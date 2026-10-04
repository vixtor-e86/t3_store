import { useState } from 'react'
import Header from '@/sections/Header'
import Hero from '@/sections/Hero'
import Marquee from '@/sections/Marquee'
import Features from '@/sections/Features'
import Brands from '@/sections/Brands'
import Promos from '@/sections/Promos'
import Products from '@/sections/Products'
import HowItWorks from '@/sections/HowItWorks'
import Booking from '@/sections/Booking'
import Footer from '@/sections/Footer'
import CatalogModal from '@/components/CatalogModal'

export default function Home() {
  const [catalogOpen, setCatalogOpen] = useState(false)

  const handleOpenCatalog = () => setCatalogOpen(true)

  return (
    <div className="min-h-screen bg-paper font-body">
      <Header onOpenCatalog={handleOpenCatalog} />
      <main>
        <Hero onOpenCatalog={handleOpenCatalog} />
        <Marquee />
        <Features />
        <Brands />
        <Promos />
        <Products onOpenCatalog={handleOpenCatalog} />
        <HowItWorks />
        <Booking prefill={null} />
      </main>
      <Footer />

      {/* Dynamic Full Catalog Modal */}
      <CatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
      />
    </div>
  )
}
