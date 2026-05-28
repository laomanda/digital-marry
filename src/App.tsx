import { useState, useEffect, Suspense, lazy } from 'react'
import { GuestWish } from './types/wish'
import { supabase } from './lib/supabase'
import SmoothScrollProvider from './components/layout/SmoothScrollProvider'
import GrainOverlay from './components/layout/GrainOverlay'
import CustomCursor from './components/layout/CustomCursor'
import Navbar from './components/layout/Navbar'
import MusicToggle from './components/layout/MusicToggle'
import Preloader from './components/layout/Preloader'

import { CoverSection } from './components/sections/CoverSection'
import HeroSection from './components/sections/HeroSection'
import { QuoteSection } from './components/sections/QuoteSection'
import { CoupleSection } from './components/sections/CoupleSection'
import { useGlobalReveal } from './hooks/useGlobalReveal'

// Lazy-loaded heavy sections below the fold
const LoveStorySection = lazy(() => import('./components/sections/LoveStorySection').then(m => ({ default: m.LoveStorySection })))
const CountdownSection = lazy(() => import('./components/sections/CountdownSection'))
const EventSection = lazy(() => import('./components/sections/EventSection'))
const RsvpSection = lazy(() => import('./components/sections/RsvpSection'))
const WishesSection = lazy(() => import('./components/sections/WishesSection'))
const GallerySection = lazy(() => import('./components/sections/GallerySection'))
const GiftSection = lazy(() => import('./components/sections/GiftSection'))
const ClosingSection = lazy(() => import('./components/sections/ClosingSection'))

export default function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false)
  const [isPreloaderDone, setIsPreloaderDone] = useState(false)
  const [guestWishes, setGuestWishes] = useState<GuestWish[]>([])

  useEffect(() => {
    // Defer Supabase request until invitation is open to prevent render-blocking the critical path
    if (!isInvitationOpen) return

    const fetchWishes = async () => {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        const formattedWishes: GuestWish[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          message: row.message,
          attending: row.attending,
          time: row.time,
          source: 'rsvp',
        }))
        setGuestWishes(formattedWishes)
      } else {
        console.error('Failed to fetch wishes from Supabase', error)
      }
    }

    fetchWishes()
  }, [isInvitationOpen])

  const handleAddWish = async (wish: GuestWish) => {
    // Optimistic UI Update
    setGuestWishes((prev) => [wish, ...prev])

    // Background Insert to Supabase
    try {
      const { error } = await supabase.from('wishes').insert([
        {
          name: wish.name,
          message: wish.message,
          attending: wish.attending,
          time: wish.time,
        },
      ])
      
      if (error) {
        console.error('Failed to insert wish to Supabase', error)
      }
    } catch (err) {
      console.error('Error inserting wish', err)
    }
  }
  useGlobalReveal()

  return (
    <SmoothScrollProvider>
      <GrainOverlay />
      <CustomCursor />
      
      {!isPreloaderDone && (
        <Preloader onComplete={() => setIsPreloaderDone(true)} />
      )}

      <CoverSection
        onOpen={() => setIsInvitationOpen(true)}
        onOpened={() => setIsInvitationOpen(true)}
        isPreloaderDone={isPreloaderDone}
      />
      <MusicToggle visible={isInvitationOpen} />
      <Navbar visible={isInvitationOpen} />

      <main>
        <HeroSection isInvitationOpen={isInvitationOpen} />
        <QuoteSection />
        <CoupleSection />
        
        {isInvitationOpen && (
          <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
            <LoveStorySection />
            <CountdownSection />
            <EventSection />

            <RsvpSection onWishSubmit={handleAddWish} />
            <WishesSection guestWishes={guestWishes} />
            <GallerySection />
            <GiftSection />
            <ClosingSection />
          </Suspense>
        )}
      </main>
    </SmoothScrollProvider>
  )
}
