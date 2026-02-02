import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import AnalyticsClient from './analytics-client'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Moringa Innovation Marketplace | Showcase Your Projects',
  description: 'Discover and showcase innovative student projects, connect with recruiters, and launch your startup journey at Moringa School\'s innovation marketplace.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { CartProvider } from '@/components/cart/cart-context'
import AuthProvider from '@/components/auth-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-google-analytics-opt-out="">
      <body suppressHydrationWarning className={`font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
        <AnalyticsClient />
      </body>
    </html>
  )
}
