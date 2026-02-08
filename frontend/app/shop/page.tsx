'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Heart, Search, ArrowUpDown, List, LayoutGrid } from 'lucide-react'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { useCart } from '@/components/cart/cart-context'
import { fetchMerchandise } from '@/lib/api'

type Product = {
  id: number
  name: string
  price?: number
  stock?: number
  image_url?: string
  description?: string
}

type SortKey = 'featured' | 'price_asc' | 'price_desc' | 'name_asc'
type ViewMode = 'grid' | 'list'

function formatKES(value: number) {
  return value.toLocaleString('en-KE', { maximumFractionDigits: 0 })
}

function safeNumber(n: unknown, fallback = 0) {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : fallback
  return v
}

export default function ShopPage() {
  const { addToCart, cart } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')
  const [view, setView] = useState<ViewMode>('grid')

  const getQty = (id: number) => cart.find((c) => c.id === id)?.quantity ?? 0

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    fetchMerchandise()
      .then((data) => {
        if (!mounted) return
        setProducts(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!mounted) return
        setError('Failed to load merchandise. Please refresh and try again.')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = products

    if (q) {
      list = list.filter((p) => {
        const hay = `${p.name ?? ''} ${p.description ?? ''}`.toLowerCase()
        return hay.includes(q)
      })
    }

    const sorted = [...list]
    sorted.sort((a, b) => {
      const ap = safeNumber(a.price, 0)
      const bp = safeNumber(b.price, 0)

      if (sort === 'price_asc') return ap - bp
      if (sort === 'price_desc') return bp - ap
      if (sort === 'name_asc') return (a.name ?? '').localeCompare(b.name ?? '')
      return 0
    })

    return sorted
  }, [products, query, sort])

  const inStockCount = useMemo(() => products.filter((p) => safeNumber(p.stock, 0) > 0).length, [products])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-12">
        {/* THEMED HEADER (Talents-like hero) */}
        <section className="relative overflow-hidden border-b border-border">
          {/* background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                      Official Store
                    </Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                      {loading ? 'Loading…' : `${products.length} products`}
                    </Badge>
                    {!loading && (
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                        {inStockCount} in stock
                      </Badge>
                    )}
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                    Moringa Merchandise
                  </h1>
                  <p className="mt-2 text-base text-foreground/60 sm:text-lg">
                    Support the community with exclusive branded merchandise.
                  </p>
                </div>

                {/* Controls Panel */}
                <Card className="w-full border-border/60 bg-background/70 p-3 backdrop-blur md:w-[520px]">
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products…"
                        className="h-10 pl-9"
                        aria-label="Search products"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant={sort === 'featured' ? 'default' : 'outline'}
                        className="h-9 flex-1"
                        onClick={() => setSort('featured')}
                      >
                        Featured
                      </Button>
                      <Button
                        type="button"
                        variant={sort === 'price_asc' ? 'default' : 'outline'}
                        className="h-9 flex-1"
                        onClick={() => setSort('price_asc')}
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Price ↑
                      </Button>
                      <Button
                        type="button"
                        variant={sort === 'price_desc' ? 'default' : 'outline'}
                        className="h-9 flex-1"
                        onClick={() => setSort('price_desc')}
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Price ↓
                      </Button>

                      {/* View toggle */}
                      <div className="ml-auto flex items-center rounded-md border border-border bg-background p-1">
                        <Button
                          type="button"
                          variant={view === 'grid' ? 'default' : 'ghost'}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setView('grid')}
                          aria-label="Grid view"
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant={view === 'list' ? 'default' : 'ghost'}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setView('list')}
                          aria-label="List view"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* subtle divider row */}
              <div className="flex items-center justify-between text-xs text-foreground/50">
                <span>Quality merchandise • Community-first</span>
                <span className="hidden sm:inline">Secure checkout • Fast delivery</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {error ? (
              <Card className="p-6">
                <div className="flex flex-col gap-2">
                  <div className="text-lg font-semibold">Something went wrong</div>
                  <p className="text-sm text-foreground/60">{error}</p>
                  <div className="pt-2">
                    <Button onClick={() => window.location.reload()}>Refresh</Button>
                  </div>
                </div>
              </Card>
            ) : loading ? (
              view === 'grid' ? (
                <ProductsSkeletonGrid />
              ) : (
                <ProductsSkeletonList />
              )
            ) : filtered.length === 0 ? (
              <Card className="p-10 text-center">
                <div className="text-lg font-semibold">No products found</div>
                <p className="mt-2 text-sm text-foreground/60">
                  Try a different search term or clear the filter.
                </p>
                <div className="mt-4">
                  <Button variant="outline" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                </div>
              </Card>
            ) : view === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCardGrid
                    key={product.id}
                    product={product}
                    qty={getQty(product.id)}
                    onAdd={() => addToCart(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    qty={getQty(product.id)}
                    onAdd={() => addToCart(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Info */}
        <section className="border-t border-border bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <InfoTile title="🚚 Fast Shipping" text="Free shipping on orders over 5,000 KES within Nairobi." />
              <InfoTile title="✨ Quality Guaranteed" text="Premium materials and printing on all products." />
              <InfoTile title="💚 Community First" text="Profits support Moringa students and community programs." />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/**
 * GRID CARD
 * - shorter cards (square image)
 * - hover-only actions (wishlist + add button appears on hover)
 */
function ProductCardGrid({
  product,
  qty,
  onAdd,
}: {
  product: Product
  qty: number
  onAdd: () => void
}) {
  const price = safeNumber(product.price, 0)
  const stock = safeNumber(product.stock, 0)
  const inStock = stock > 0

  const [imgError, setImgError] = useState(false)
  const showImg = Boolean(product.image_url) && !imgError

  return (
    <Card className="group overflow-hidden transition hover:shadow-sm">
      <div className="relative aspect-square bg-muted">
        {showImg ? (
          <Image
            src={product.image_url as string}
            alt={product.name ?? 'Product'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        <div className="absolute left-2 top-2 flex flex-wrap gap-2">
          {inStock ? (
            <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 text-xs">In stock</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Out of stock
            </Badge>
          )}
          {qty > 0 && (
            <Badge variant="secondary" className="text-xs">
              In cart · {qty}
            </Badge>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-2 bottom-2 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            type="button"
            size="sm"
            className="pointer-events-auto h-8 flex-1"
            onClick={onAdd}
            disabled={!inStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="pointer-events-auto h-8 w-8 bg-background/80 backdrop-blur"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-medium">{product.name}</h3>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-base font-semibold text-primary">{formatKES(price)} KES</span>
          <span className="text-xs text-foreground/60">{inStock ? `${stock} left` : 'Unavailable'}</span>
        </div>
      </div>
    </Card>
  )
}

function ProductRow({
  product,
  qty,
  onAdd,
}: {
  product: Product
  qty: number
  onAdd: () => void
}) {
  const price = safeNumber(product.price, 0)
  const stock = safeNumber(product.stock, 0)
  const inStock = stock > 0

  const [imgError, setImgError] = useState(false)
  const showImg = Boolean(product.image_url) && !imgError

  return (
    <Card className="p-3">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
          {showImg ? (
            <Image
              src={product.image_url as string}
              alt={product.name ?? 'Product'}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-medium">{product.name}</h3>
                {qty > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    In cart · {qty}
                  </Badge>
                )}
              </div>
              {product.description ? (
                <p className="mt-0.5 line-clamp-1 text-xs text-foreground/60">{product.description}</p>
              ) : null}
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-primary">{formatKES(price)} KES</div>
              <div className="text-[11px] text-foreground/60">{inStock ? `${stock} left` : 'Unavailable'}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" size="sm" className="h-8" onClick={onAdd} disabled={!inStock}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>

          <Button type="button" variant="outline" size="icon" className="h-8 w-8" aria-label="Add to wishlist">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function ProductsSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-square animate-pulse bg-muted" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        </Card>
      ))}
    </div>
  )
}

function ProductsSkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="p-3">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 animate-pulse rounded-md bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          </div>
        </Card>
      ))}
    </div>
  )
}

function InfoTile({ title, text }: { title: string; text: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-foreground/60">{text}</p>
    </div>
  )
}
