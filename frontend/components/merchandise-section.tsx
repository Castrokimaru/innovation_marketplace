'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RefreshCcw, ArrowRight, Eye } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchMerchandise, type BackendMerchandise } from '@/lib/api/merchandise'

function formatKes(value: number) {
  if (!Number.isFinite(value)) return 'KES 0'
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(value)
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur">
      <div className="h-40 w-full animate-pulse bg-white/10" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-full animate-pulse rounded bg-white/10" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-8 w-24 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  )
}

export function MerchandiseSection() {
  const router = useRouter()

  const [items, setItems] = useState<BackendMerchandise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMerchandise()
      setItems(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load merchandise.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const featured = useMemo(() => items.slice(0, 3), [items])

  return (
    <section
      className="relative overflow-hidden py-12 md:py-16"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1580910051071-4ced1e7a40f8?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="inline-flex w-fit items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
              Merch Store
            </p>

            <h2 className="text-3xl font-semibold tracking-tight font-display text-slate-100">
              Official <span className="text-yellow-400">Merch</span> Shop
            </h2>

            <p className="text-sm text-slate-300 max-w-xl">
              Support the community with exclusive Moringa branded merchandise.
            </p>
          </div>

          <Link href="/shop" className="hidden md:block">
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-400/40 text-yellow-200 hover:bg-yellow-400/10 hover:text-yellow-100"
            >
              Shop All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-white/20 bg-white/10 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-200">{error}</p>
              <Button size="sm" variant="outline" onClick={load}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-xl border border-white/20 bg-white/10 p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-100 font-display">
              No merchandise available yet
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Add items from the admin side and they’ll appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => {
              const inStock = (item.stock ?? 0) > 0

              return (
                <Card
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/90 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* Whole card clickable */}
                  <Link
                    href="/shop"
                    className="absolute inset-0 z-0"
                    aria-label={`Open ${item.name}`}
                  />

                  {/* Image */}
                  <div className="relative z-10 h-40 overflow-hidden bg-muted">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                      aria-hidden="true"
                    />

                    {/* Stock badge */}
                    <div className="absolute left-3 top-3 z-20">
                      {inStock ? (
                        <Badge className="bg-white/90 text-gray-900 text-xs">
                          {item.stock} left
                        </Badge>
                      ) : (
                        <Badge className="bg-black/70 text-white text-xs">
                          Out
                        </Badge>
                      )}
                    </div>

                    {/* Hover Quick View */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="pointer-events-auto">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 text-gray-900 hover:bg-white"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            router.push('/shop')
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Quick view
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative z-10 p-4 space-y-2">
                    <h3 className="text-sm font-medium leading-snug line-clamp-1 font-display text-slate-900">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.description ?? 'Premium quality merch.'}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <span className="text-base font-semibold text-primary whitespace-nowrap">
                        {formatKes(item.price)}
                      </span>

                      {/* Display-only CTA (honest) */}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          router.push('/shop')
                        }}
                      >
                        View item
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="flex justify-center md:hidden">
          <Link href="/shop">
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-400/40 text-yellow-200 hover:bg-yellow-400/10 hover:text-yellow-100"
            >
              Shop All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
