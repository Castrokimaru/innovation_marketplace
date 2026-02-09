'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { BriefcaseBusiness } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { Heart, Github, Globe, Calendar, Users, ArrowRight, Link2, FolderSearch } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

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
  technologies: string
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
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString()
}

function getStatusBadgeVariant(status: string) {
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

function isProbablyUrl(value?: string) {
  if (!value) return false
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
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

  const { toast } = useToast()

  const [isLiked, setIsLiked] = useState(false)
  const [projects, setProjects] = useState<BackendProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

  const learnMoreHref = '#about'
  const demoLink = project && isProbablyUrl(project.video) ? project.video : undefined

  // Optional: add when backend provides it
  const githubLink = undefined as string | undefined

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Your browser blocked clipboard access.',
        variant: 'destructive',
      })
    }
  }

  /**
   * ✅ WORKING HIRE IMPLEMENTATION (no backend needed)
   * Opens the recruiter’s email client with pre-filled recipients (team emails).
   */
  const onHire = () => {
    if (!project) return

    const emails = (project.team_members ?? [])
      .map((m) => m.email)
      .filter(Boolean)

    if (emails.length === 0) {
      toast({
        title: 'No contact info available',
        description: 'This project does not include team emails yet.',
        variant: 'destructive',
      })
      return
    }

    const to = emails.join(',')
    const subject = encodeURIComponent(`Hiring inquiry: ${project.title}`)
    const body = encodeURIComponent(
      `Hi ${project.submitted_name ?? 'Team'},\n\n` +
        `I’m interested in your project "${project.title}".\n` +
        `Could we schedule a quick call to discuss availability, timeline, and next steps?\n\n` +
        `Thanks,\n` +
        `Recruiter`
    )

    // Opens default mail app (works reliably)
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
            <p className="text-foreground/60">Loading project…</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FolderSearch className="h-7 w-7 text-foreground/60" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Project not found</h2>
            <p className="text-foreground/60 mt-2">The project you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
              {/* Left */}
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                    {categoryLabel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`rounded-full px-3 py-1 text-xs border ${getStatusBadgeVariant(project.status)}`}
                  >
                    {project.status}
                  </Badge>
                  <a
                    href={learnMoreHref}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-foreground/70 backdrop-blur hover:bg-background"
                  >
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
                <p className="mt-3 text-base text-foreground/60 sm:text-lg">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Submitted {formatDate(project.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{teamSize} team members</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Submitted by {project.submitted_name}</span>
                  </div>
                </div>

                {/* quick actions row */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="outline" onClick={onCopyLink}>
                    <Link2 className="mr-2 h-4 w-4" />
                    {copied ? 'Copied!' : 'Copy link'}
                  </Button>

                  <a href={learnMoreHref}>
                    <Button>
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>

                  {demoLink && (
                    <a href={demoLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline">
                        <Globe className="mr-2 h-4 w-4" />
                        Demo / Video
                      </Button>
                    </a>
                  )}

                  {githubLink && (
                    <a href={githubLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Action Card */}
              <Card className="border-border/60 bg-background/70 p-5 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">Project actions</div>
                    <div className="mt-1 text-xs text-foreground/60">Save, share, and contact the team.</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3 py-2 text-2xl">💻</div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsLiked((v) => !v)}
                    aria-label="Like project"
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </Button>

                  <Button type="button" className="w-full" onClick={onHire} aria-label="Hire team">
                    <BriefcaseBusiness className="mr-2 h-4 w-4" />
                    Hire
                  </Button>
                </div>

                <div className="mt-4 space-y-2 rounded-lg border border-border/60 bg-background p-3">
                  <div className="text-xs text-foreground/60">Quick info</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Category</span>
                    <span className="font-medium">{categoryLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Team size</span>
                    <span className="font-medium">{teamSize}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Status</span>
                    <span className="font-medium">{project.status}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <a href={learnMoreHref} className="block">
                    <Button className="w-full">
                      Learn more about this project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Left content */}
              <div className="md:col-span-2 space-y-10">
                {/* About */}
                <div id="about" className="scroll-mt-28 space-y-4">
                  <h2 className="text-2xl font-bold sm:text-3xl">About this project</h2>
                  <Card className="border-border/60 bg-background/70 p-6 backdrop-blur">
                    <p className="text-foreground/70 whitespace-pre-line leading-relaxed">{project.description}</p>
                  </Card>
                </div>

                {/* Technologies */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold sm:text-2xl">Technologies used</h2>
                  <Card className="border-border/60 bg-background/70 p-6 backdrop-blur">
                    <div className="flex flex-wrap gap-2">
                      {technologies.length > 0 ? (
                        technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="rounded-full bg-secondary/20">
                            {tech}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No technologies listed.</p>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Explore links */}
                {(demoLink || githubLink) && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold sm:text-2xl">Explore</h2>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {demoLink && (
                        <a href={demoLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full">
                            <Globe className="mr-2 h-4 w-4" />
                            View demo
                          </Button>
                        </a>
                      )}
                      {githubLink && (
                        <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" className="w-full">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub repository
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
                <Card className="border-border/60 bg-background/70 p-6 backdrop-blur">
                  <h3 className="font-bold text-lg">Development team</h3>

                  {team.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {team.map((m) => {
                        const fullName = `${m.first_name} ${m.last_name}`.trim()
                        return (
                          <div
                            key={m.id}
                            className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold">
                              {(m.first_name?.[0] ?? m.email?.[0] ?? '?').toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{fullName || m.email}</p>
                              <p className="text-xs text-muted-foreground">{m.role}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">No team members listed.</p>
                  )}
                </Card>

                {/* Categories */}
                <Card className="border-border/60 bg-background/70 p-6 backdrop-blur">
                  <h3 className="font-bold text-lg">Categories</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.categories?.length ? (
                      project.categories.map((c) => (
                        <Badge key={c.id} variant="secondary" className="rounded-full bg-secondary/20">
                          {c.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No categories assigned.</p>
                    )}
                  </div>
                </Card>

                {/* Learn more */}
                <Card className="border-border/60 bg-background/70 p-6 backdrop-blur">
                  <h3 className="font-bold text-lg">Learn more</h3>
                  <p className="mt-2 text-sm text-foreground/60">
                    Want more context? Read the full overview and technologies used.
                  </p>
                  <a href={learnMoreHref} className="mt-4 block">
                    <Button variant="outline" className="w-full">
                      Jump to project overview
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
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
