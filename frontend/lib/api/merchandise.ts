const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:5555'

export type BackendMerchandise = {
  id: number
  name: string
  price: number 
  stock: number
  image_url: string
  description?: string 
}

export async function fetchMerchandise(): Promise<BackendMerchandise[]> {
  const res = await fetch(`${BASE}/merchandise`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch merchandise (${res.status})`)
  return res.json()
}
