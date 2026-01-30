'use client'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { FeaturedProjects } from '@/components/featured-projects'
import { MerchandiseSection } from '@/components/merchandise-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { SessionProvider } from "next-auth/react"

export default function Home({session}:any) {
  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  )
}
