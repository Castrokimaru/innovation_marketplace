import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { FeaturedProjects } from '@/components/featured-projects'
import { MerchandiseSection } from '@/components/merchandise-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <FeaturedProjects />
        <MerchandiseSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
