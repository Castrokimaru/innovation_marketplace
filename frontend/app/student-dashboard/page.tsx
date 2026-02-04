'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import Link from 'next/link'
import { Plus, Search, RefreshCcw, LogOut } from 'lucide-react'

import { fetchMyProjectsFromAllProjects } from '@/lib/api'
import { ProjectCard } from '@/components/project-card'

type ApiProject = {
  id: number
  title: string
  description: string
  video?: string
  technologies?: string[] | string
  submitted_name?: string
  status?: string
  created_at?: string
  team_members?: Array<{
    id: number
    first_name: string
    last_name: string
    email: string
    role: string
  }>
  categories?: Array<{ id: number; name: string }>
}

type UiProjectCard = {
  id: number
  title: string
  description: string
  image?: string
  technologies: string[] | string
  category: string
  author: string
  views?: number
  rating?: number
}

const CATEGORY_OPTIONS = ['All', 'HealthTech', 'EdTech', 'FinTech', 'AgriTech', 'Other'] as const
type CategoryFilter = (typeof CATEGORY_OPTIONS)[number]

function normalizeTech(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

function LoadingShell() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="h-8 w-72 rounded bg-muted animate-pulse" />
        <div className="mt-6 h-10 rounded bg-muted animate-pulse" />
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [projects, setProjects] = useState<ApiProject[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('All')
  const [tech, setTech] = useState('All')

  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'student') {
      router.replace('/auth/signin')
    }
  }, [session, status, router])

  const token = session?.accessToken
  const userId = session?.user?.id

  const loadProjects = async () => {
    if (!userId) return
    setLoadingProjects(true)
    setError(null)

    try {
      const mine = await fetchMyProjectsFromAllProjects(userId, token)
      setProjects(Array.isArray(mine) ? mine : [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load projects')
    } finally {
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    if (!session || session.user.role !== 'student') return

    let alive = true
    ;(async () => {
      try {
        setLoadingProjects(true)
        setError(null)
        const mine = await fetchMyProjectsFromAllProjects(userId!, token)
        if (!alive) return
        setProjects(Array.isArray(mine) ? mine : [])
      } catch (e: any) {
        if (!alive) return
        setError(e?.message ?? 'Failed to load projects')
      } finally {
        if (!alive) return
        setLoadingProjects(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [session, token, userId])

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await signOut({ redirect: false })
      router.replace('/auth/signin')
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  const allTechOptions = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => normalizeTech(p.technologies).forEach((t) => set.add(t)))
    return ['All', ...Array.from(set)]
  }, [projects])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return projects.filter((p) => {
      const techs = normalizeTech(p.technologies)
      const catNames = (p.categories ?? []).map((c) => c.name)
      const teamNames = (p.team_members ?? [])
        .map((m) => `${m.first_name} ${m.last_name}`.trim())
        .join(' ')

      const haystack = [p.title, p.description, techs.join(' '), catNames.join(' '), p.submitted_name, teamNames]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesQuery = !q || haystack.includes(q)
      const matchesCategory = category === 'All' ? true : catNames.includes(category)
      const matchesTech = tech === 'All' ? true : techs.includes(tech)

      return matchesQuery && matchesCategory && matchesTech
    })
  }, [projects, query, category, tech])

  const cards: UiProjectCard[] = useMemo(() => {
    const username = session?.user?.username ?? 'Student'
    return filtered.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      technologies: p.technologies ?? [],
      category: p.categories?.[0]?.name ?? 'Other',
      author: p.submitted_name ?? username,
      views: 0,
      rating: 0,
      image: undefined,
    }))
  }, [filtered, session?.user?.username])

  if (status === 'loading') return <LoadingShell />
  if (!session || session.user.role !== 'student') return null

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
            <p className="text-foreground/70">
              Welcome, <span className="font-medium text-primary">{session.user.username}</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/profile">
              <Button variant="outline">Edit Profile</Button>
            </Link>

            <Link href="/submit-project">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Submit Project
              </Button>
            </Link>

            <Button variant="outline" className="gap-2" onClick={handleSignOut} disabled={signingOut}>
              <LogOut className="h-4 w-4" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mt-8 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, tech, category, team member…"
                className="pl-9"
              />
            </div>

            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryFilter)}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
            >
              {allTechOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-foreground/60">
            <span>
              Showing <span className="font-medium">{cards.length}</span> projects
            </span>

            <Button variant="ghost" size="sm" onClick={loadProjects} className="gap-2" disabled={loadingProjects}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mt-6 p-5 border border-destructive/30">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-destructive">Couldn’t load projects</p>
                <p className="text-sm text-foreground/70">{error}</p>
              </div>
              <Button onClick={loadProjects}>Try again</Button>
            </div>
          </Card>
        )}

        {/* Projects */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Projects</h2>
            <Badge variant="secondary">{loadingProjects ? 'Loading…' : 'Ready'}</Badge>
          </div>

          {loadingProjects ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <Card className="mt-6 p-10 text-center">
              <p className="text-lg font-semibold">No projects found</p>
              <p className="mt-2 text-sm text-foreground/70">
                Submit your first project to showcase your work.
              </p>
              <Link href="/dashboard/projects/new">
                <Button className="mt-5">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Project
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {cards.map((p) => (
                <ProjectCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  description={p.description}
                  image={p.image}
                  technologies={p.technologies}
                  category={p.category}
                  author={p.author}
                  views={p.views}
                  rating={p.rating}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
