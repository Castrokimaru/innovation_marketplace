'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

const MERCHANDISE = [
  {
    id: 1,
    name: 'Moringa Developer Hoodie',
    price: '2,500 KES',
    image: 'https://i.pinimg.com/1200x/41/54/99/41549938a74f8f9ebb198f46bd3ae9f0.jpg',
    color: 'Deep Blue',
  },
  {
    id: 2,
    name: 'Innovation Coffee Mug',
    price: '800 KES',
    image: 'https://i.pinimg.com/1200x/92/41/01/924101e26071144209c345e5831c2423.jpg',
    color: 'White',
  },
  {
    id: 3,
    name: 'Tech Sticker Pack',
    price: '300 KES',
    image: 'https://i.pinimg.com/1200x/13/44/70/13447082ecc65aa08aaf52a24b3fea46.jpg',
    color: 'Multi-color',
  },
  {
    id: 4,
    name: 'Moringa Branded Cap',
    price: '1,200 KES',
    image: 'https://i.pinimg.com/736x/e8/1a/c9/e81ac9fd848de86a93133edfbbbd7b90.jpg',
    color: 'Black',
  },
]

export function MerchandiseSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold">Official Merch Shop</h2>
            <p className="text-lg text-foreground/60">
              Support the Moringa community with exclusive branded merchandise
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {MERCHANDISE.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                
                <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-foreground/60">{item.color}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{item.price}</span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Link href="/shop">
              <Button size="lg" variant="outline">
                Shop All Merchandise
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
