'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart } from 'lucide-react'

const PRODUCTS = [
  {
    id: 1,
    name: 'Moringa Developer Hoodie',
    price: 2500,
    image: '👕',
    color: 'Deep Blue',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: 'Innovation Coffee Mug',
    price: 800,
    image: '☕',
    color: 'White',
    sizes: ['One Size'],
    inStock: true,
    rating: 4.5,
    reviews: 45,
  },
  {
    id: 3,
    name: 'Tech Sticker Pack',
    price: 300,
    image: '🎨',
    color: 'Multi-color',
    sizes: ['One Size'],
    inStock: true,
    rating: 4.6,
    reviews: 67,
  },
  {
    id: 4,
    name: 'Moringa Branded Cap',
    price: 1200,
    image: '🧢',
    color: 'Black',
    sizes: ['One Size'],
    inStock: true,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 5,
    name: 'Developer T-Shirt',
    price: 1500,
    image: '👔',
    color: 'Navy Blue',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 6,
    name: 'Moringa Water Bottle',
    price: 1000,
    image: '🚰',
    color: 'Silver',
    sizes: ['One Size'],
    inStock: true,
    rating: 4.4,
    reviews: 38,
  },
]

export default function ShopPage() {
  const [cart, setCart] = useState<number[]>([])

  const addToCart = (id: number) => {
    setCart([...cart, id])
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Moringa Merchandise Store</h1>
            <p className="text-lg text-foreground/60">
              Support the Moringa community with exclusive branded merchandise
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((product) => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-300">
                    {product.image}
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-foreground/60">{product.color}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{product.price.toLocaleString()} KES</div>
                        <div className="text-xs text-foreground/60">
                          ⭐ {product.rating} ({product.reviews} reviews)
                        </div>
                      </div>
                      {product.inStock ? (
                        <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">In Stock</Badge>
                      ) : (
                        <Badge variant="outline">Out of Stock</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      {product.sizes.length > 1 && (
                        <div className="text-xs font-medium">Sizes: {product.sizes.join(', ')}</div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-muted/30 py-12 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">🚚 Fast Shipping</h3>
                <p className="text-sm text-foreground/60">
                  Free shipping on orders over 5,000 KES within Nairobi
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">✨ Quality Guaranteed</h3>
                <p className="text-sm text-foreground/60">
                  Premium materials and printing on all products
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">💚 Community First</h3>
                <p className="text-sm text-foreground/60">
                  100% of profits support Moringa students
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
