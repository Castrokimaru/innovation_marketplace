'use client'

import { Users, Lightbulb, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description:
        'Sign up as a student or recruiter and build a profile that highlights your skills or hiring needs.',
      icon: Users,
    },
    {
      number: '02',
      title: 'Submit or Browse Projects',
      description:
        'Students submit innovative projects. Recruiters browse approved work and connect with top talent.',
      icon: Lightbulb,
    },
    {
      number: '03',
      title: 'Connect and Collaborate',
      description:
        'Build partnerships, get feedback, and turn ideas into real-world solutions and opportunities.',
      icon: TrendingUp,
    },
  ]

  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80')",
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex w-fit items-center rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-100 backdrop-blur">
            Simple workflow
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl font-display">
            How it <span className="text-yellow-400">works</span>
          </h2>

          <p className="mt-3 text-lg text-slate-200/85">
            Get started in three simple steps and join the innovation community.
          </p>
        </div>

        <div className="relative mt-14">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[34px] hidden md:block"
            aria-hidden="true"
          >
            <div className="mx-auto h-px max-w-5xl bg-white/15" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <Card
                  key={step.number}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <div
                    className="pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(250,204,21,0.12), rgba(236,72,153,0.20))',
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-yellow-100/70">
                        Step {step.number}
                      </span>

                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-400/15 bg-yellow-400/10 text-yellow-50">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold text-slate-100 font-display">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-200/80">
                      {step.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs text-slate-200/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/50" />
                      <span>Fast onboarding • Clear next steps</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
