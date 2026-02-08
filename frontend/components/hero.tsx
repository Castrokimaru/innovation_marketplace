'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type PreviewItem = {
  title: string
  tag: string
  img: string
  href: string
}

export function Hero() {
  const { data: session } = useSession()
  const router = useRouter()

  const callbackUrl =
    typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : '/'

  const goToSignIn = () => {
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  // Public browse (recommended for landing page)
  const handleExploreProjects = () => router.push('/projects')

  // If you want protected browse, swap to this
  const handleExploreProjectsProtected = () => {
    if (!session) {
      goToSignIn()
      return
    }
    router.push('/projects')
  }

  const preview: PreviewItem[] = [
    {
      title: 'AgriTech Smart Farming',
      tag: 'AgriTech',
      img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80',
      href: '/projects?category=AgriTech',
    },
    {
      title: 'HealthTech Appointment System',
      tag: 'HealthTech',
      img: 'https://images.unsplash.com/photo-1581093588401-22d00f98f1a0?auto=format&fit=crop&w=900&q=80',
      href: '/projects?category=HealthTech',
    },
    {
      title: 'FinTech Mobile Wallet',
      tag: 'FinTech',
      img: 'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=900&q=80',
      href: '/projects?category=FinTech',
    },
  ]

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80')",
        }}
        aria-hidden="true"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/55 to-black/85"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/90"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left */}
          <div className="space-y-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-1.5 backdrop-blur">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-100">
                Welcome to Innovation Hub
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl lg:text-6xl font-display">
              Turn your ideas into{' '}
              <span className="text-yellow-400">living innovations</span>
            </h1>

            <p className="text-lg leading-relaxed text-slate-200/90 sm:text-xl">
              Showcase capstone projects, connect with recruiters and investors,
              and take the first step toward launching. The Moringa Innovation
              Marketplace is where student ideas become market realities.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90"
                onClick={goToSignIn}
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-yellow-400/40 bg-white/5 text-yellow-100 hover:bg-yellow-400/10 hover:text-yellow-50"
                onClick={handleExploreProjects}
                // onClick={handleExploreProjectsProtected}
              >
                Explore projects
              </Button>
            </div>

            {/* Trust signals */}
            <div className="grid max-w-xl grid-cols-3 gap-4 pt-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <p className="text-xs text-slate-200/70">Curated</p>
                <p className="text-sm font-semibold text-slate-100">
                  Approved projects
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <p className="text-xs text-slate-200/70">Discover</p>
                <p className="text-sm font-semibold text-slate-100">
                  Top student teams
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <p className="text-xs text-slate-200/70">Connect</p>
                <p className="text-sm font-semibold text-slate-100">
                  Recruiters & mentors
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            {/* Glow */}
            <div
              className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-primary/25 via-yellow-400/15 to-accent/25 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
              <div
                className="absolute inset-0 opacity-60"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.16) 0 2px, transparent 3px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.10) 0 3px, transparent 4px), radial-gradient(circle at 55% 80%, rgba(255,255,255,0.14) 0 2px, transparent 3px)",
                }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-black/35"
                aria-hidden="true"
              />

              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-yellow-100/70">
                      Featured this week
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-100 font-display">
                      Top student projects
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleExploreProjects}
                    className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-100 hover:bg-yellow-400/15"
                  >
                    Browse all
                  </button>
                </div>

                {/* Mini cards */}
                <div className="mt-6 space-y-4">
                  {preview.map((p) => (
                    <div
                      key={p.title}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={p.img}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-100 line-clamp-1">
                          {p.title}
                        </p>
                        <p className="mt-1 text-xs text-yellow-100/70">
                          {p.tag}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => router.push(p.href)}
                        className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-100 hover:bg-yellow-400/15"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative border-t border-white/10 bg-black/25 px-6 py-4">
                <p className="text-xs text-slate-200/75">
                  Curated, approved projects — built by Moringa students.
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-center md:justify-end" />
          </div>
        </div>
      </div>
    </section>
  )
}
