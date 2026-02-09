const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:5555'

export type BackendProject = {
  id: number
  title: string
  description: string
  video: string
  technologies: string
  submitted_name: string
  status: 'approved' | 'pending' | 'rejected'
  created_at: string
  team_members: Array<{
    id: number
    first_name: string
    last_name: string
    email: string
    role: string
  }>
  categories: Array<{ id: number; name: string }>
  likes_count?: number
  liked_by_me?: boolean
}

export async function fetchProjects(): Promise<BackendProject[]> {
  const res = await fetch(`${BASE}/projects`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`)
  return res.json()
}

/** ---- UI shape that ProjectCard expects ---- */
export type ProjectCardVM = {
  id: number
  title: string
  description: string
  image?: string
  technologies?: string[] | string
  category: string
  author: string
  views?: number
  rating?: number
}

export function toProjectCardVM(p: BackendProject): ProjectCardVM {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    // You don’t have an image field in backend yet — use video thumbnail or fallback.
    // If video is a YouTube link, you can derive a thumbnail (optional; see note below).
    image: undefined,
    technologies: p.technologies, // your card already supports CSV string
    category: p.categories?.[0]?.name ?? 'Uncategorized',
    author: p.submitted_name || 'Student Team',
    // Backend doesn’t provide these yet; safe defaults:
    views: 0,
    rating: 0,
  }
}

/** Fetch “featured” projects for landing page */
export async function fetchFeaturedProjects(limit = 4): Promise<ProjectCardVM[]> {
  const projects = await fetchProjects()

  // Typically you only want approved projects on landing page
  const approved = projects.filter((p) => p.status === 'approved')

  // “Featured” rule for now: newest approved first
  approved.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return approved.slice(0, limit).map(toProjectCardVM)
}
