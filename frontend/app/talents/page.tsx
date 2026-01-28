'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react'

const TALENTS = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Full Stack Developer',
    avatar: '👨‍💻',
    bio: 'Passionate about building scalable web applications and solving complex problems.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    projects: 3,
    rating: 4.9,
    email: 'alice@moringa.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 2,
    name: 'Bob Smith',
    role: 'Mobile Developer',
    avatar: '👩‍💻',
    bio: 'Expert in iOS and Android development with a focus on user experience.',
    skills: ['Flutter', 'React Native', 'Kotlin', 'Swift'],
    projects: 5,
    rating: 4.8,
    email: 'bob@moringa.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 3,
    name: 'Carol Davis',
    role: 'AI/ML Engineer',
    avatar: '🧑‍🔬',
    bio: 'Specializing in machine learning, data science, and artificial intelligence.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'],
    projects: 4,
    rating: 4.7,
    email: 'carol@moringa.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'DevOps Engineer',
    avatar: '🛠️',
    bio: 'Infrastructure and deployment specialist with expertise in cloud technologies.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    projects: 6,
    rating: 4.9,
    email: 'david@moringa.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 5,
    name: 'Emma Thompson',
    role: 'Frontend Developer',
    avatar: '🎨',
    bio: 'Creative developer focused on beautiful and accessible user interfaces.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'UI/UX'],
    projects: 4,
    rating: 4.8,
    email: 'emma@moringa.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 6,
    name: 'Frank Chen',
    role: 'Backend Developer',
    avatar: '⚙️',
    bio: 'Building robust APIs and databases that power modern applications.',
    skills: ['Go', 'Java', 'PostgreSQL', 'Redis'],
    projects: 5,
    rating: 4.7,
    email: 'frank@moringa.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
]

export default function TalentsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const ROLES = ['All', 'Full Stack Developer', 'Mobile Developer', 'AI/ML Engineer', 'DevOps Engineer', 'Frontend Developer', 'Backend Developer']

  const filtered = TALENTS.filter((talent) => {
    const matchesSearch =
      talent.name.toLowerCase().includes(search.toLowerCase()) ||
      talent.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = filter === 'All' || talent.role === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Find Talented Developers</h1>
            <p className="text-lg text-foreground/60">
              Discover and hire talented Moringa students for your next project
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-40 bg-background border-b border-border py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <Input
                placeholder="Search by name or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="flex flex-wrap gap-2">
                {ROLES.map((role) => (
                  <Button
                    key={role}
                    variant={filter === role ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(role)}
                    className={filter === role ? 'bg-primary' : ''}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Talents Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filtered.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((talent) => (
                  <Card key={talent.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl">{talent.avatar}</div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-lg">{talent.name}</h3>
                          <p className="text-sm text-primary font-medium">{talent.role}</p>
                          <div className="text-xs text-foreground/60 pt-1">
                            ⭐ {talent.rating} • {talent.projects} projects
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-foreground/60">{talent.bio}</p>

                      <div className="flex flex-wrap gap-2">
                        {talent.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1 bg-primary hover:bg-primary/90 text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          Hire
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                          <Github className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-foreground/60 mb-4">No talents found matching your search</p>
                <Button variant="outline" onClick={() => {
                  setSearch('')
                  setFilter('All')
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
