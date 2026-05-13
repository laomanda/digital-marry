import SmoothScrollProvider from './components/layout/SmoothScrollProvider'
import GrainOverlay from './components/layout/GrainOverlay'
import CustomCursor from './components/layout/CustomCursor'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import HeroSection from './components/sections/HeroSection'
import OpeningSection from './components/sections/OpeningSection'
import CoupleSection from './components/sections/CoupleSection'
import LoveStorySection from './components/sections/LoveStorySection'
import EventSection from './components/sections/EventSection'
import CountdownSection from './components/sections/CountdownSection'
import GallerySection from './components/sections/GallerySection'
import RsvpSection from './components/sections/RsvpSection'
import GiftSection from './components/sections/GiftSection'
import WishesSection from './components/sections/WishesSection'
import ClosingSection from './components/sections/ClosingSection'

export default function App() {
  return (
    <SmoothScrollProvider>
      <GrainOverlay />
      <CustomCursor />
      <Navbar />

      <main>
        <HeroSection />
        <OpeningSection />
        <CoupleSection />
        <LoveStorySection />
        <EventSection />
        <CountdownSection />
        <GallerySection />
        <RsvpSection />
        <GiftSection />
        <WishesSection />
        <ClosingSection />
      </main>

      <Footer />
    </SmoothScrollProvider>
  )
}
