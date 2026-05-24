import SmoothScrollProvider from './components/layout/SmoothScrollProvider'
import GrainOverlay from './components/layout/GrainOverlay'
import CustomCursor from './components/layout/CustomCursor'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import { CoverSection } from './components/sections/CoverSection'
import HeroSection from './components/sections/HeroSection'
import { QuoteSection } from './components/sections/QuoteSection'
import CoupleSection from './components/sections/CoupleSection'
import LoveStorySection from './components/sections/LoveStorySection'
import CountdownSection from './components/sections/CountdownSection'
import EventSection from './components/sections/EventSection'
import { DressCodeSection } from './components/sections/DressCodeSection'
import { LiveStreamingSection } from './components/sections/LiveStreamingSection'
import { WeddingFrameSection } from './components/sections/WeddingFrameSection'
import RsvpSection from './components/sections/RsvpSection'
import WishesSection from './components/sections/WishesSection'
import GallerySection from './components/sections/GallerySection'
import GiftSection from './components/sections/GiftSection'
import ClosingSection from './components/sections/ClosingSection'
import { useGlobalReveal } from './hooks/useGlobalReveal'

export default function App() {
  useGlobalReveal()
  return (
    <SmoothScrollProvider>
      <GrainOverlay />
      <CustomCursor />
      <CoverSection />
      <Navbar />

      <main>
        <HeroSection />
        <QuoteSection />
        <CoupleSection />
        <LoveStorySection />
        <CountdownSection />
        <EventSection />
        <DressCodeSection />
        <LiveStreamingSection />
        <WeddingFrameSection />
        <RsvpSection />
        <WishesSection />
        <GallerySection />
        <GiftSection />
        <ClosingSection />
      </main>

      <Footer />
    </SmoothScrollProvider>
  )
}
