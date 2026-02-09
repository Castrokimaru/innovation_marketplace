'use client'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { FeaturedProjects } from '@/components/featured-projects'
import { HowItWorks } from '@/components/how-it-works'
import { WhyChooseUs } from '@/components/why-choose-us'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { SessionProvider } from "next-auth/react"
import { MerchandiseSection } from '@/components/merchandise-section'

export default function Home({session}:any) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen">
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <FeaturedProjects />
        <HowItWorks />
        <MerchandiseSection/>
        <WhyChooseUs />
        <CTASection />
      
      </main>
      <Footer />
    </div>
    </SessionProvider>
  )
}
