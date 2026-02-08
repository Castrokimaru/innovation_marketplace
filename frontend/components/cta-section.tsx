'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function CTASection() {
  const { data: session } = useSession()
  const router = useRouter()

  const callbackUrl =
    typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : '/'

  const goToSignIn = () => {
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/15 to-black/35"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-1.5 text-yellow-100 backdrop-blur">
            <Zap className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium">Ready to launch?</span>
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl font-display">
            Share your innovation with the <span className="text-yellow-300">world</span>
          </h2>

          <p className="mt-3 text-base text-white/80 sm:text-lg">
            Have an amazing capstone project? Post it and start connecting with recruiters,
            investors, and collaborators.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => router.push('/projects')}
            >
              Explore projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-yellow-400/35 bg-yellow-400/10 text-yellow-50 hover:bg-yellow-400/15"
              onClick={() => {
                // If you want joining protected -> go to auth
                // Otherwise route to signup page when you add it.
                if (!session) {
                  goToSignIn()
                  return
                }
                router.push('/profile')
              }}
            >
              Join as student or recruiter
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-3">
          {[
            { value: '500+', label: 'Projects submitted' },
            { value: '200+', label: 'Students connected' },
            { value: '50+', label: 'Recruiters active' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center text-white backdrop-blur"
            >
              <p className="text-3xl font-semibold font-display">{s.value}</p>
              <p className="mt-1 text-sm text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
