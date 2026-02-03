'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PRODUCTS } from '@/lib/products'
import { useCart } from '@/components/cart/cart-context'
import { fetchMerchandise } from '@/lib/api'

export default function ShopPage() {
  const { addToCart, cart } = useCart()
  const [products, setProducts] = useState<typeof PRODUCTS>(PRODUCTS)
  const [loading, setLoading] = useState(false)

  // helper to show qty in local grid
  const getQty = (id: number) => {
    const entry = cart.find((c) => c.id === id)
    return entry ? entry.quantity : 0
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchMerchandise()
      .then((data) => {
        if (mounted) setProducts(data)
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

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
              {loading ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">Loading products...</div>
              ) : (
                products.map((product: any) => (
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
                          <div className="text-2xl font-bold text-primary">{(product.price || 0).toLocaleString()} KES</div>
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
                        {product.sizes && product.sizes.length > 1 && (
                          <div className="text-xs font-medium">Sizes: {product.sizes.join(', ')}</div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2 items-center">
                        <Button
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={() => addToCart(product.id)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <div className="text-sm text-foreground/60">{getQty(product.id) > 0 ? `In cart: ${getQty(product.id)}` : ''}</div>
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
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
