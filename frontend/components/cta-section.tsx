'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function CTASection() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // const handleBecomeRecruiter = () => {
  //   if (!session && mounted) {
  //     router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
  //   } else {
  //     router.push('/recruiter-dashboard')
  //   }
  // }

  // const handleSubmitProject = () => {
  //   if (!session && mounted) {
  //     router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
  //   } else {
  //     router.push('/submit-project')
  //   }
  // }

  return (
    <section className="py-24 bg-primary/95 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ready to Launch?</span>
            </div>
            <h2 className="text-4xl font-bold text-white">
              Share Your Innovation with the World
            </h2>
            <p className="text-lg text-foreground/60">
              Have an amazing capstone project? Post it now and start connecting with recruiters, investors, and collaborators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => router.push('/projects')}
            >
              Explore Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto bg-transparent"
              onClick={() => router.push('./auth/signin')}
            >
              Join as Student or Recruiter
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-8 text-center">
            <div>
              <div className="mt-16 pt-12 border-t border-white/20">500+</div>
              <div className="text-white text-white/70">Projects Submitted</div>
            </div>
            <div>
              <div className="mt-16 pt-12 border-t border-white/20">200+</div>
              <div className="text-white text-white/70">Students Connected</div>
            </div>
            <div>
              <div className="mt-16 pt-12 border-t border-white/20">50+</div>
              <div className="text-white text-white/70">Recruiters Active</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
