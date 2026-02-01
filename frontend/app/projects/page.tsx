'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

const ALL_PROJECTS = [
  {
    id: 1,
    title: 'HealthTech Appointment System',
    description: 'AI-powered healthcare appointment booking platform with real-time clinic sync.',
    category: 'HealthTech',
    author: 'Team Alpha',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    views: 1250,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1519494080410-f9aa8f52f274?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'EdTech Learning Analytics Dashboard',
    description: 'Real-time student performance analytics with predictive learning paths.',
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
    description: 'Secure mobile payment solution with peer-to-peer transfers.',
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
    description: 'IoT and AI-based crop monitoring for optimal yield.',
    category: 'AgriTech',
    author: 'Team Delta',
    technologies: ['Python', 'Arduino', 'AWS'],
    views: 850,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    title: 'Social Media Analytics Tool',
    description: 'Real-time social media performance tracking and insights generation.',
    category: 'SaaS',
    author: 'Team Echo',
    technologies: ['React', 'MongoDB', 'Express'],
    views: 650,
    rating: 4.5,
  },
  {
    id: 6,
    title: 'E-Commerce Platform',
    description: 'Full-stack marketplace with payment integration and seller dashboard.',
    category: 'E-Commerce',
    author: 'Team Foxtrot',
    technologies: ['Next.js', 'Prisma', 'Stripe'],
    views: 1100,
    rating: 4.8,
  },
  {
    id: 7,
    title: 'AI Resume Parser',
    description: 'Machine learning-powered resume analysis for recruitment teams.',
    category: 'AI/ML',
    author: 'Team Golf',
    technologies: ['Python', 'TensorFlow', 'FastAPI'],
    views: 750,
    rating: 4.7,
  },
  {
    id: 8,
    title: 'Real Estate Search Engine',
    description: 'Advanced search with property recommendations and virtual tours.',
    category: 'Real Estate',
    author: 'Team Hotel',
    technologies: ['React', 'Node.js', 'Elasticsearch'],
    views: 920,
    rating: 4.6,
  },
]

const CATEGORIES = ['All', 'HealthTech', 'EdTech', 'FinTech', 'AgriTech', 'SaaS', 'E-Commerce', 'AI/ML', 'Real Estate']

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const filtered = ALL_PROJECTS.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.author.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || project.category === category
    return matchesSearch && matchesCategory
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views
    if (sortBy === 'rating') return b.rating - a.rating
    return b.id - a.id
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Explore Projects</h1>
            <p className="text-lg text-foreground/60">
              Discover {filtered.length} innovative student-built projects
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-40 bg-background border-b border-border py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by project name, author, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <Button
                        key={cat}
                        variant={category === cat ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCategory(cat)}
                        className={category === cat ? 'bg-primary' : ''}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="w-full sm:w-40">
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {sorted.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sorted.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-foreground/60 mb-4">No projects found matching your criteria</p>
                <Button variant="outline" onClick={() => {
                  setSearch('')
                  setCategory('All')
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
