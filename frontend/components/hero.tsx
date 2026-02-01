'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Welcome to Innovation Hub</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-balance">
              Turn Your Ideas Into <span className="text-primary">Living Innovations</span>
            </h1>
            <p className="text-xl text-foreground/60 text-balance">
              Showcase your capstone projects, connect with recruiters, investors, and launch your startup journey. The Moringa Innovation Marketplace is where student ideas become market realities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/projects" className="flex">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Explore Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80" alt="Innovation" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml?utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2220%22 cy=%2220%22 r=%225%22 fill=%22rgba(255,255,255,0.1)%22/><circle cx=%2280%22 cy=%2235%22 r=%228%22 fill=%22rgba(255,255,255,0.05)%22/><circle cx=%2250%22 cy=%2270%22 r=%226%22 fill=%22rgba(255,255,255,0.1)%22/></svg>')] opacity-50" />
              </div>
          </div>
        </div>
      </div>
    </section>
  )
}
