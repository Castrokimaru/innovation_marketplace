const BASE = process.env.NEXT_PUBLIC_BASE_URL || ''

function authHeaders(token?: string) {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Backend ProjectList.get()
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
}

// UI shape for table
export type ProjectRow = {
  id: number
  title: string
  author: string
  category: string
  status: 'approved' | 'pending' | 'rejected'
  submitted: string
}

function mapToRow(p: BackendProject): ProjectRow {
  return {
    id: p.id,
    title: p.title,
    author: p.submitted_name,
    category: p.categories?.[0]?.name ?? 'Other',
    status: p.status,
    submitted: String(p.created_at).slice(0, 10),
  }
}

export async function fetchProjects(): Promise<ProjectRow[]> {
  const res = await fetch(`${BASE}/projects`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`)
  const data: BackendProject[] = await res.json()
  return data.map(mapToRow)
}

export async function approveProject(projectId: number, token: string) {
  const res = await fetch(`${BASE}/admin/projects/${projectId}/approve`, {
    method: 'POST',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(`Approve failed (${res.status})`)
  return res.json()
}

export async function rejectProject(projectId: number, token: string) {
  const res = await fetch(`${BASE}/admin/projects/${projectId}/reject`, {
    method: 'POST',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(`Reject failed (${res.status})`)
  return res.json()
}
