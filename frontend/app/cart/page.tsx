'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  ShoppingCart,
  Loader2,
  CreditCard,
  Smartphone,
  Truck,
  CheckCircle,
} from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import { fetchMerchandise, createOrder } from '@/lib/api'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<
    'cart' | 'payment' | 'payment-details' | 'confirmation'
  >('cart')
  const [selectedPayment, setSelectedPayment] = useState('')
  const [paymentDetails, setPaymentDetails] = useState({
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })
  const [orderDetails, setOrderDetails] = useState<any>(null)

  /* Redirect unauthenticated users */
  useEffect(() => {
    if (status === 'unauthenticated') {
      const callbackUrl = searchParams.get('callbackUrl') || '/cart'
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    }
  }, [status, router, searchParams])

  // Fetch products for cart items
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchMerchandise()
      .then((data) => { if (mounted) setProducts(data) })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-foreground/60">Checking authentication...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Redirect to sign-in if not authenticated (backup check)
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-foreground/60">Redirecting to sign in...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const items = cart.map((c) => {
    const product = products.find((p) => p.id === c.id)
    return { ...c, product }
  }).filter(Boolean)

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0)

  async function handleCheckout() {
    if (!session?.user?.email) {
      window.location.href = '/auth/signin'
      return
    }

    setCheckoutLoading(true)
    try {
      const payload = items.map((i) => ({ merchandise_id: i.id, quantity: i.quantity }))
      const res = await createOrder(payload, session?.user?.email as string)
      clearCart()
      alert(`Order ${res.order_id} created. Total: ${res.total}`)
    } catch (err: any) {
      alert(err.message || 'Checkout failed')
    } finally { setCheckoutLoading(false) }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Your Cart</h1>
            <p className="text-lg text-foreground/60">Review items in your cart before checkout</p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {items.length === 0 ? (
              <div className="text-center py-24">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="text-2xl font-bold mt-4">Your cart is empty</h2>
                <p className="text-foreground/60 mt-2">Add some great merchandise from the shop</p>
                <div className="mt-6">
                  <a href="/shop">
                    <Button>Browse Store</Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{item.product?.image}</div>
                        <div>
                          <div className="font-medium">{item.product?.name}</div>
                          <div className="text-sm text-foreground/60">{item.product?.color}</div>
                          <div className="text-sm text-foreground/60 mt-1">{(item.product?.price || 0).toLocaleString()} KES</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                          <Input className="w-12 text-center mx-2" value={String(item.quantity)} onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 0)} />
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-foreground/60">Subtotal</span>
                      <span className="font-bold">{subtotal.toLocaleString()} KES</span>
                    </div>
                    <div className="mt-4">
                      <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleCheckout} disabled={checkoutLoading}>
                        {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" className="w-full" onClick={() => clearCart()}>Clear Cart</Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

