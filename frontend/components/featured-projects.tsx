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
    image: 'https://media.istockphoto.com/id/916632830/photo/doctor-icons-medical-care.jpg?s=2048x2048&w=is&k=20&c=gHJMw9jS3n_WYqgX2UGEwwgBWpakxDzFj3uAa3AcMhE=',
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
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
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
