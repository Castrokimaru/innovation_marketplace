'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { Heart, Share2, Github, Globe, Calendar, Users } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_BASE_URL || ''

type BackendTeamMember = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
}

type BackendCategory = { id: number; name: string }

type BackendProject = {
  id: number
  title: string
  description: string
  video: string
  technologies: string // comma-separated in your backend
  submitted_name: string
  status: 'approved' | 'pending' | 'rejected'
  created_at: string
  team_members: BackendTeamMember[]
  categories: BackendCategory[]
}

function parseTechnologies(raw: string): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function formatDate(value: string) {
  // your backend returns str(p.created_at) which may not be ISO; this is safer
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString()
}

function getStatusBadgeVariant(status: string) {
  // keep using your current styling approach
  switch (status) {
    case 'approved':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
    case 'rejected':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
    default:
      return 'bg-muted text-foreground/70'
  }
}

async function fetchAllProjects(): Promise<BackendProject[]> {
  const res = await fetch(`${BASE}/projects`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`)
  return res.json()
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const projectId = Number(params.id)

  const [isLiked, setIsLiked] = useState(false)
  const [projects, setProjects] = useState<BackendProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchAllProjects()
        setProjects(data)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const project = useMemo(() => {
    if (!Number.isFinite(projectId)) return undefined
    return projects.find((p) => p.id === projectId)
  }, [projects, projectId])

  const technologies = useMemo(() => parseTechnologies(project?.technologies ?? ''), [project?.technologies])

  const categoryLabel = project?.categories?.[0]?.name ?? 'Other'
  const team = project?.team_members ?? []
  const teamSize = team.length

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
            <p className="text-foreground/60">Loading project…</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h2 className="text-2xl font-bold">Could not load project</h2>
            <p className="text-foreground/60 mt-2">{error}</p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h2 className="text-2xl font-bold">Project not found</h2>
            <p className="text-foreground/60 mt-2">The project you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Optional: derive links from existing fields (since backend does not provide liveLink/githubLink)
  const liveLink = project.video || undefined // if your "video" is actually a URL; otherwise remove this
  const githubLink = undefined // add when backend provides it

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <div className="inline-flex gap-2">
                  <Badge className="bg-primary">{categoryLabel}</Badge>
                  <Badge variant="outline" className={getStatusBadgeVariant(project.status)}>
                    {project.status}
                  </Badge>
                </div>

                <h1 className="text-5xl font-bold">{project.title}</h1>
                <p className="text-xl text-foreground/60">{project.description}</p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground/60">Submitted {formatDate(project.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground/60">{teamSize} team members</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground/60">Submitted by {project.submitted_name}</span>
                  </div>
                </div>
              </div>

              <Card className="p-6 space-y-4">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center text-6xl">
                  💻
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="w-full flex justify-center items-center p-2 rounded-md hover:bg-muted/50 transition-colors"
                    aria-label="Like project"
                  >
                    <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                  </button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      // simple share: copies current URL
                      navigator.clipboard?.writeText(window.location.href)
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-8">
                {/* About */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">About This Project</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground/70 whitespace-pre-line">{project.description}</p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Technologies Used</h2>
                  <div className="flex flex-wrap gap-3">
                    {technologies.length > 0 ? (
                      technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-secondary/20">
                          {tech}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No technologies listed.</p>
                    )}
                  </div>
                </div>

                {/* Links (only show if you have them) */}
                {(liveLink || githubLink) && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Explore the Project</h2>
                    <div className="flex gap-4">
                      {liveLink && (
                        <a href={liveLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            <Globe className="mr-2 h-4 w-4" />
                            View Link
                          </Button>
                        </a>
                      )}
                      {githubLink && (
                        <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" className="w-full bg-transparent">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub Repository
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Team */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-bold text-lg">Development Team</h3>

                  {team.length > 0 ? (
                    <div className="space-y-3">
                      {team.map((m) => {
                        const fullName = `${m.first_name} ${m.last_name}`.trim()
                        return (
                          <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                              {(m.first_name?.[0] ?? m.email?.[0] ?? '?').toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{fullName || m.email}</p>
                              <p className="text-xs text-muted-foreground">{m.role}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No team members listed.</p>
                  )}
                </Card>

                {/* Categories */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-bold text-lg">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.categories?.length ? (
                      project.categories.map((c) => (
                        <Badge key={c.id} variant="secondary" className="bg-secondary/20">
                          {c.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No categories assigned.</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
