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
      return typeof data?.message === 'string' ? data.message : JSON.stringify(data)
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
    author: p.submitted_name || '—',
    category: p.categories?.[0]?.name ?? 'Other',
    status: p.status,
    submitted: String(p.created_at ?? '').slice(0, 10) || '—',
  }
}

export async function fetchProjects(): Promise<ProjectRow[]> {
  const res = await fetch(`${BASE}/projects`, { cache: 'no-store' })

  if (!res.ok) {
    const details = await readError(res)
    const baseMsg = `Failed to fetch projects (${res.status}).`
    throw new Error(details ? `${baseMsg} ${details}` : baseMsg)
  }

  const data = (await res.json()) as unknown
  if (!Array.isArray(data)) return []
  return (data as BackendProject[]).map(mapToRow)
}

export async function approveProject(projectId: number, token: string) {
  if (!token) throw new Error('Missing admin token. Please sign in again.')

  const res = await fetch(`${BASE}/admin/projects/${projectId}/approve`, {
    method: 'POST',
    headers: authHeaders(token),
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

export async function rejectProject(projectId: number, token: string) {
  if (!token) throw new Error('Missing admin token. Please sign in again.')

  const res = await fetch(`${BASE}/admin/projects/${projectId}/reject`, {
    method: 'POST',
    headers: authHeaders(token),
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
