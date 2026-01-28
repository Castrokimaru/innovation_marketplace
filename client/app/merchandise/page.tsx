'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockMerchandise } from '@/lib/mock-data';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CartItem {
  merchandise_id: number;
  quantity: number;
  price: number;
}

export default function MerchandisePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (merchandiseId: number, price: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.merchandise_id === merchandiseId);
      if (existing) {
        return prev.map((item) =>
          item.merchandise_id === merchandiseId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { merchandise_id: merchandiseId, quantity: 1, price }];
    });
  };

  const removeFromCart = (merchandiseId: number) => {
    setCart((prev) => prev.filter((item) => item.merchandise_id !== merchandiseId));
  };

  const updateQuantity = (merchandiseId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(merchandiseId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.merchandise_id === merchandiseId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Merchandise Store</h1>
            <p className="text-muted-foreground">
              Exclusive Moringa School Innovation merchandise
            </p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition relative"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Cart View */}
        {showCart && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => {
                    const product = mockMerchandise.find((m) => m.id === item.merchandise_id);
                    return (
                      <div
                        key={item.merchandise_id}
                        className="flex items-center justify-between p-4 bg-secondary/30 rounded"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{product?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.merchandise_id, item.quantity - 1)}
                              className="px-2 py-1 border border-border rounded hover:bg-secondary"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.merchandise_id, item.quantity + 1)}
                              className="px-2 py-1 border border-border rounded hover:bg-secondary"
                            >
                              +
                            </button>
                          </div>
                          <p className="w-24 text-right font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.merchandise_id)}
                            className="text-destructive hover:bg-destructive/10 px-3 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border pt-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-foreground">Total:</p>
                    <p className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</p>
                  </div>
                  <Button className="w-full">Proceed to Checkout</Button>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMerchandise.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition">
              {/* Product Image */}
              <div className="relative aspect-square bg-secondary/30 overflow-hidden">
                <Image
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover hover:scale-105 transition"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {item.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white font-bold text-lg">Out of Stock</p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Stock Status */}
                {item.stock < 20 && item.stock > 0 && (
                  <Alert className="mb-4 py-2 px-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Only {item.stock} left in stock
                    </AlertDescription>
                  </Alert>
                )}

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                  <Button
                    onClick={() => addToCart(item.id, item.price)}
                    disabled={item.stock === 0}
                    size="sm"
                    className="gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground/5 py-8 px-4 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Moringa School Innovation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
