const BASE = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function fetchMerchandise() {
  const res = await fetch(`${BASE}/merchandise`)
  if (!res.ok) throw new Error('Failed to fetch merchandise')
  return res.json()
}

export async function fetchProjects() {
  const res = await fetch(`${BASE}/projects`)
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export async function createOrder(items: Array<{ merchandise_id: number; quantity: number }>, token?: string) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create project')
  }
  return res.json()
}

export async function signup(payload: { first_name: string; last_name: string; email: string; password: string; role?: string }) {
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
