const BASE = process.env.NEXT_PUBLIC_BASE_URL || ''

function authHeaders(token?: string) {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchMerchandise() {
  const res = await fetch(`${BASE}/merchandise`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch merchandise')
  return res.json()
}

export async function createMerchandise(payload: {
  name: string
  description: string
  price: number
  stock: number
  image_url: string
}, token?: string) {
  const res = await fetch(`${BASE}/merchandise`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create merchandise')
  }
  return res.json()
}

export async function fetchProjects(token?: string) {
  const res = await fetch(`${BASE}/projects`, {
    headers: {
      ...authHeaders(token),
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export async function fetchMyProjectsFromAllProjects(userId: number, token?: string) {
  const projects = await fetchProjects(token)

  if (!Array.isArray(projects)) return []

  return projects.filter((p: any) => {
    const team = Array.isArray(p.team_members) ? p.team_members : []
    return team.some((m: any) => Number(m.id) === Number(userId))
  })
}

export async function createOrder(
  items: Array<{ merchandise_id: number; quantity: number }>,
  token?: string
) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create order')
  }
  return res.json()
}

export async function createProject(payload: any, token?: string) {
  const res = await fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create project')
  }
  return res.json()
}

export async function signup(payload: {
  first_name: string
  last_name: string
  email: string
  password: string
  role?: string
}) {
  const res = await fetch(`${BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Signup failed')
  }
  return data
}

export async function fetchApprovedProjects() {
  const res = await fetch(`${BASE}/recruiters/projects`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch approved projects')
  return res.json()
}

