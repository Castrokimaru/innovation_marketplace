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

  /* Fetch products */
  useEffect(() => {
    let mounted = true
    setLoading(true)

    fetchMerchandise()
      .then((data) => mounted && setProducts(data))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    )
  }

  const items = cart
    .map((c) => {
    const product = products.find((p) => p.id === c.id)
      return product ? { ...c, product } : null
    })
    .filter(Boolean) as any[]

  const subtotal = items.reduce(
    (sum, i) => sum + (i.product.price || 0) * i.quantity,
    0
  )

  async function handleCheckout() {
    if (!session?.user?.email) {
      router.push('/auth/signin')
      return
    }
    setCheckoutStep('payment')
  }

  async function handlePaymentSubmit() {
    if (!selectedPayment) {
      alert('Please select a payment method')
      return
    }
    setCheckoutStep('payment-details')
  }

  async function handlePaymentDetailsSubmit() {
    // Basic validation
    if (selectedPayment === 'mpesa' && !paymentDetails.phone) {
      alert('Please enter your M-Pesa phone number')
      return
    }
    if (selectedPayment === 'card' && (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv)) {
      alert('Please fill in all card details')
      return
    }

    setCheckoutLoading(true)
    try {
      const payload = items.map((i) => ({
        merchandise_id: i.id,
        quantity: i.quantity,
      }))

      const res = await createOrder(payload, session?.accessToken)
      setOrderDetails(res)
      clearCart()
      setCheckoutStep('confirmation')
    } catch (err: any) {
      alert(err.message || 'Failed to create order')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* HEADER */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">
              {checkoutStep === 'cart' && 'Your Cart'}
              {checkoutStep === 'payment' && 'Select Payment Method'}
              {checkoutStep === 'payment-details' && 'Enter Payment Details'}
              {checkoutStep === 'confirmation' && 'Order Confirmed'}
            </h1>
            <p className="text-lg text-foreground/60">
              {checkoutStep === 'cart' &&
                'Review items in your cart before checkout'}
              {checkoutStep === 'payment' &&
                'Choose how you want to pay for your order'}
              {checkoutStep === 'payment-details' &&
                'Enter your payment information to complete the order'}
              {checkoutStep === 'confirmation' &&
                'Your order has been placed successfully'}
            </p>
          </div>
        </section>

        {/* BODY */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">

            {/* CART STEP */}
            {checkoutStep === 'cart' && (
              <>
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
                        <Card
                          key={item.id}
                          className="p-4 flex gap-4 items-center"
                        >
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.product.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.product.price.toLocaleString()} KES
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              -
                            </Button>
                            <Input
                              className="w-14 text-center"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  Number(e.target.value) || 1
                                )
                              }
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-4 h-fit">
                      <div className="flex justify-between mb-4">
                        <span>Subtotal</span>
                        <span className="font-bold">
                          {subtotal.toLocaleString()} KES
                        </span>
                      </div>
                      <Button className="w-full" onClick={handleCheckout}>
                        Proceed to Checkout
                      </Button>
                    </Card>
                  </div>
                )}
              </>
            )}

            {/* PAYMENT STEP */}
            {checkoutStep === 'payment' && (
              <Card className="max-w-2xl mx-auto p-6">
                <h3 className="text-lg font-semibold mb-6">Choose Payment Method</h3>
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label
                      htmlFor="mpesa"
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">M-Pesa</div>
                        <div className="text-sm text-muted-foreground">
                          Pay with your mobile money
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-muted-foreground">
                          Visa, Mastercard, etc.
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

