import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
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
import { LoveStorySection } from './components/sections/LoveStorySection'
import CountdownSection from './components/sections/CountdownSection'
import EventSection from './components/sections/EventSection'
import RsvpSection from './components/sections/RsvpSection'
import LiveStreamSection from './components/sections/LiveStreamSection'
import WishesSection from './components/sections/WishesSection'
import GallerySection from './components/sections/GallerySection'
import GiftSection from './components/sections/GiftSection'
import ClosingSection from './components/sections/ClosingSection'
import { useGlobalReveal } from './hooks/useGlobalReveal'
import { useAosReplayGuard } from './hooks/useAosReplayGuard'
import { ScrollTrigger } from './lib/gsap'

export default function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false)
  const [isInvitationOpened, setIsInvitationOpened] = useState(false)
  const [isPreloaderDone, setIsPreloaderDone] = useState(false)
  const [guestWishes, setGuestWishes] = useState<GuestWish[]>([])

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
      offset: 80,
      delay: 0,
      anchorPlacement: 'top-bottom',
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    })

    AOS.refreshHard()
  }, [])

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

  useEffect(() => {
    if (isInvitationOpened) {
      // Small delay to ensure CoverSection exit is completely done and DOM has reflowed
      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
        AOS.refreshHard()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [isInvitationOpened])

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

  // Trigger global animations whenever these states change
  useGlobalReveal([isInvitationOpen, isInvitationOpened])
  useAosReplayGuard([isInvitationOpened, guestWishes.length])

  return (
    <SmoothScrollProvider>
      <GrainOverlay />
      <CustomCursor />
      
      {!isPreloaderDone && (
        <Preloader onComplete={() => setIsPreloaderDone(true)} />
      )}

      <CoverSection
        onOpen={() => setIsInvitationOpen(true)}
        onOpened={() => setIsInvitationOpened(true)}
        isPreloaderDone={isPreloaderDone}
      />
      <MusicToggle visible={isInvitationOpen} />
      <Navbar visible={isInvitationOpen} />

      <main>
        <HeroSection isInvitationOpen={isInvitationOpen} />
        <QuoteSection />
        <CoupleSection />
        
        {isInvitationOpen && (
          <>
            <div id="love-story"><LoveStorySection /></div>
            <div id="countdown"><CountdownSection /></div>
            <div id="event"><EventSection /></div>
            <div id="rsvp"><RsvpSection onWishSubmit={handleAddWish} /></div>
            <div id="live-stream"><LiveStreamSection /></div>
            <div id="wishes"><WishesSection guestWishes={guestWishes} /></div>
            <div id="gallery"><GallerySection /></div>
            <div id="gift"><GiftSection /></div>
            <div id="closing"><ClosingSection /></div>
          </>
        )}
      </main>
    </SmoothScrollProvider>
  )
}
