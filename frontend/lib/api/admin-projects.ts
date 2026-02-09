const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:5555'

function authHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function readError(res: Response) {
  const contentType = res.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/json')) {
      const data = await res.json()
      if (typeof data?.message === 'string') return data.message
      if (typeof data?.error === 'string') return data.error
      return JSON.stringify(data)
    }
  } catch {
    // ignore
  }
  try {
    const text = await res.text()
    return text || null
  } catch {
    return null
  }
}

export type BackendProject = {
  id: number
  title: string
  description: string
  video: string
  github_url: string
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
  approval_reason?: string | null
  rejection_reason?: string | null
}

export type ProjectRow = {
  id: number
  title: string
  author: string
  category: string
  status: 'approved' | 'pending' | 'rejected'
  submitted: string
}

export type ProjectsPayload = {
  rows: ProjectRow[]
  byId: Record<number, BackendProject>
}

function mapToRow(p: BackendProject): ProjectRow {
  return {
    id: p.id,
    title: p.title,
    author: p.submitted_name || '—',
    category: p.categories?.[0]?.name ?? 'Other',
    status: p.status,
    submitted: String(p.created_at ?? '').slice(0, 10) || '—',
  }
}

export async function fetchProjects(): Promise<ProjectsPayload> {
  const res = await fetch(`${BASE}/projects`, { cache: 'no-store' })

  if (!res.ok) {
    const details = await readError(res)
    const baseMsg = `Failed to fetch projects (${res.status}).`
    throw new Error(details ? `${baseMsg} ${details}` : baseMsg)
  }

  const data = (await res.json()) as unknown
  const arr = Array.isArray(data) ? (data as BackendProject[]) : []

  const byId: Record<number, BackendProject> = {}
  for (const p of arr) byId[p.id] = p

  return { rows: arr.map(mapToRow), byId }
}

export async function approveProject(projectId: number, token: string, reason?: string) {
  if (!token) throw new Error('Missing admin token. Please sign in again.')

  const res = await fetch(`${BASE}/admin/projects/${projectId}/approve`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ reason: reason ?? '' }),
  })

  if (!res.ok) {
    const details = await readError(res)
    const baseMsg =
      res.status === 401
        ? 'Unauthorized (401). Please sign in again.'
        : res.status === 403
          ? 'Forbidden (403). Admin access required.'
          : `Approve failed (${res.status}).`
    throw new Error(details ? `${baseMsg} ${details}` : baseMsg)
  }

  return res.json().catch(() => ({}))
}

export async function rejectProject(projectId: number, token: string, reason?: string) {
  if (!token) throw new Error('Missing admin token. Please sign in again.')

  const res = await fetch(`${BASE}/admin/projects/${projectId}/reject`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ reason: reason ?? '' }),
  })

  if (!res.ok) {
    const details = await readError(res)
    const baseMsg =
      res.status === 401
        ? 'Unauthorized (401). Please sign in again.'
        : res.status === 403
          ? 'Forbidden (403). Admin access required.'
          : `Reject failed (${res.status}).`
    throw new Error(details ? `${baseMsg} ${details}` : baseMsg)
  }

  return res.json().catch(() => ({}))
}
