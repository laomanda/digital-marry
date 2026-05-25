import { useState, useEffect } from 'react'
import { GuestWish } from './types/wish'
import { supabase } from './lib/supabase'
import SmoothScrollProvider from './components/layout/SmoothScrollProvider'
import GrainOverlay from './components/layout/GrainOverlay'
import CustomCursor from './components/layout/CustomCursor'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import MusicToggle from './components/layout/MusicToggle'
import Preloader from './components/layout/Preloader'

import { CoverSection } from './components/sections/CoverSection'
import HeroSection from './components/sections/HeroSection'
import { QuoteSection } from './components/sections/QuoteSection'
import CoupleSection from './components/sections/CoupleSection'
import LoveStorySection from './components/sections/LoveStorySection'
import CountdownSection from './components/sections/CountdownSection'
import EventSection from './components/sections/EventSection'
import RsvpSection from './components/sections/RsvpSection'
import WishesSection from './components/sections/WishesSection'
import GallerySection from './components/sections/GallerySection'
import GiftSection from './components/sections/GiftSection'
import ClosingSection from './components/sections/ClosingSection'
import { useGlobalReveal } from './hooks/useGlobalReveal'

export default function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false)
  const [isPreloaderDone, setIsPreloaderDone] = useState(false)
  const [guestWishes, setGuestWishes] = useState<GuestWish[]>([])

  useEffect(() => {
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
  }, [])

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

      <CoverSection onOpened={() => setIsInvitationOpen(true)} isPreloaderDone={isPreloaderDone} />
      <MusicToggle visible={isInvitationOpen} />
      <Navbar visible={isInvitationOpen} />

      <main>
        <HeroSection isInvitationOpen={isInvitationOpen} />
        <QuoteSection />
        <CoupleSection />
        <LoveStorySection />
        <CountdownSection />
        <EventSection />

        <RsvpSection onWishSubmit={handleAddWish} />
        <WishesSection guestWishes={guestWishes} />
        <GallerySection />
        <GiftSection />
        <ClosingSection />
      </main>

      <Footer />
    </SmoothScrollProvider>
  )
}
