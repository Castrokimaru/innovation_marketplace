const BASE = process.env.NEXT_PUBLIC_BASE_URL || ''

function authHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export type AdminUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  status: string // "active" | "inactive" (per model)
  created_at: string // isoformat
}

export async function fetchAdminUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${BASE}/admin/users`, {
    method: 'GET',
    headers: authHeaders(token),
    cache: 'no-store',
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(`Failed to fetch users (${res.status}). ${msg}`)
  }

  return res.json()
}
