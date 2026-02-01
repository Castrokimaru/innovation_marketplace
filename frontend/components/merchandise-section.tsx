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
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    color: 'Deep Blue',
  },
  {
    id: 2,
    name: 'Innovation Coffee Mug',
    price: '800 KES',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    color: 'White',
  },
  {
    id: 3,
    name: 'Tech Sticker Pack',
    price: '300 KES',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    color: 'Multi-color',
  },
  {
    id: 4,
    name: 'Moringa Branded Cap',
    price: '1,200 KES',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    color: 'Black',
  },
]

export function MerchandiseSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
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
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
