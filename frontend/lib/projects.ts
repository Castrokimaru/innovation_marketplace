const BASE = process.env.NEXT_PUBLIC_BASE_URL || ''

function authHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchProjectById(id: string | number, token?: string) {
  const res = await fetch(`${BASE}/projects/${id}`, {
    method: 'GET',
    headers: authHeaders(token),
    cache: 'no-store',
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(`Failed to fetch project (${res.status}). ${msg}`)
  }

  return res.json()
}
