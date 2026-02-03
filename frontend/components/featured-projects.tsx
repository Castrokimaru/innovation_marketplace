'use client'

import { ProjectCard } from './project-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const FEATURED_PROJECTS = [
  {
    id: 1,
    title: 'HealthTech Appointment System',
    description:
      'AI-powered healthcare appointment booking platform with real-time clinic sync and automated reminders.',
    category: 'HealthTech',
    author: 'Team Alpha',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    views: 1250,
    rating: 4.8,
    image:
      'https://media.istockphoto.com/id/916632830/photo/doctor-icons-medical-care.jpg?s=2048x2048&w=is&k=20&c=gHJMw9jS3n_WYqgX2UGEwwgBWpakxDzFj3uAa3AcMhE=',
  },
  {
    id: 2,
    title: 'EdTech Learning Analytics Dashboard',
    description:
      'Real-time student performance analytics with predictive learning path recommendations.',
    category: 'EdTech',
    author: 'Team Beta',
    technologies: ['Next.js', 'Python', 'TensorFlow'],
    views: 980,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'FinTech Mobile Wallet',
    description:
      'Secure mobile payment solution with peer-to-peer transfers and spend analytics.',
    category: 'FinTech',
    author: 'Team Gamma',
    technologies: ['Flutter', 'Firebase', 'Stripe'],
    views: 1540,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'AgriTech Smart Farming',
    description:
      'IoT and AI-based crop monitoring system for optimal yield and resource management.',
    category: 'AgriTech',
    author: 'Team Delta',
    technologies: ['Python', 'Arduino', 'AWS'],
    views: 850,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
]

export function FeaturedProjects() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      {/* Overlay (keep it simple for good contrast) */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {/* Header */}
          <div className="max-w-2xl space-y-3">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Featured Projects
            </h2>
            <p className="text-lg text-white/80">
              Discover the most innovative student-built solutions on our platform.
            </p>
          </div>

          {/* Cards grid (equal-height rows) */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
            {FEATURED_PROJECTS.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center pt-2">
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="group border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
