'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Hero() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExploreProjects = () => {
    if (!session && mounted) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
    } else {
      router.push('/projects')
    }
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for better text readability */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Welcome to Innovation Hub</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-balance text-white">
              Turn Your Ideas Into <span className="text-yellow-400">Living Innovations</span>
            </h1>
            <p className="text-xl text-white/80 text-balance">
              Showcase your capstone projects, connect with recruiters, investors, and launch your startup journey. The Moringa Innovation Marketplace is where student ideas become market realities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                onClick={() => router.push('./auth/signin')}
                >
                  Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </div>
          </div>
          <div className="relative">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden relative">
      
                <div className="absolute inset-0 bg-[url('data:image/svg+xml?utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2220%22 cy=%2220%22 r=%225%22 fill=%22rgba(255,255,255,0.1)%22/><circle cx=%2280%22 cy=%2235%22 r=%228%22 fill=%22rgba(255,255,255,0.05)%22/><circle cx=%2250%22 cy=%2270%22 r=%226%22 fill=%22rgba(255,255,255,0.1)%22/></svg>')] opacity-50" />
              </div>
          </div>
        </div>
      </div>
    </section>
  )
}
