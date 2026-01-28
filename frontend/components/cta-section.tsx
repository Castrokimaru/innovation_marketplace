'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ready to Launch?</span>
            </div>
            <h2 className="text-4xl font-bold text-balance">
              Share Your Innovation with the World
            </h2>
            <p className="text-lg text-foreground/60">
              Have an amazing capstone project? Post it now and start connecting with recruiters, investors, and collaborators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit-project" className="flex">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                Submit Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Become a Recruiter
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-8">
            {[
              { icon: '📈', label: 'Showcase Your Work', desc: 'Build your portfolio and reach millions' },
              { icon: '💼', label: 'Land Opportunities', desc: 'Connect with companies and investors' },
              { icon: '🚀', label: 'Launch a Startup', desc: 'Turn your idea into a business' },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl">{item.icon}</div>
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
