'use client'

import { ProjectCard } from './project-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const FEATURED_PROJECTS = [
  {
    id: 1,
    title: 'HealthTech Appointment System',
    description: 'AI-powered healthcare appointment booking platform with real-time clinic sync and automated reminders.',
    category: 'HealthTech',
    author: 'Team Alpha',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    views: 1250,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'EdTech Learning Analytics Dashboard',
    description: 'Real-time student performance analytics with predictive learning path recommendations.',
    category: 'EdTech',
    author: 'Team Beta',
    technologies: ['Next.js', 'Python', 'TensorFlow'],
    views: 980,
    rating: 4.6,
  },
  {
    id: 3,
    title: 'FinTech Mobile Wallet',
    description: 'Secure mobile payment solution with peer-to-peer transfers and spend analytics.',
    category: 'FinTech',
    author: 'Team Gamma',
    technologies: ['Flutter', 'Firebase', 'Stripe'],
    views: 1540,
    rating: 4.9,
  },
  {
    id: 4,
    title: 'AgriTech Smart Farming',
    description: 'IoT and AI-based crop monitoring system for optimal yield and resource management.',
    category: 'AgriTech',
    author: 'Team Delta',
    technologies: ['Python', 'Arduino', 'AWS'],
    views: 850,
    rating: 4.7,
  },
]

export function FeaturedProjects() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold">Featured Projects</h2>
            <p className="text-lg text-foreground/60">
              Discover the most innovative student-built solutions on our platform
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURED_PROJECTS.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Link href="/projects">
              <Button size="lg" variant="outline" className="group bg-transparent">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
