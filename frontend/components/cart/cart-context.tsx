'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'
export interface CartItem {
  id: number
  quantity: number
}

interface CartContextValue {
  cart: CartItem[]
  totalItems: number
  addToCart: (id: number, qty?: number) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch {}
  }, [cart])

  function addToCart(id: number, qty = 1) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === id)
      if (found) {
        const next = prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + qty } : p))
        toast({ title: 'Added to cart', description: `Updated quantity to ${next.find((x) => x.id === id)?.quantity}` })
        return next
      }
      toast({ title: 'Added to cart', description: 'Item added to your cart' })
      return [...prev, { id, quantity: qty }]
    })
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  function updateQuantity(id: number, qty: number) {
    if (qty <= 0) return removeFromCart(id)
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p)))
  }

  function clearCart() {
    setCart([])
  }

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, totalItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
