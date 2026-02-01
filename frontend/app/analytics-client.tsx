'use client'

import React, { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/next'

export default function AnalyticsClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Ensure the server-rendered `data-google-analytics-opt-out` attribute
    // exists on the client too to prevent hydration mismatch warnings.
    try {
      document.documentElement.setAttribute('data-google-analytics-opt-out', '')
    } catch (e) {
      // ignore in non-browser envs
    }

    setMounted(true)
  }, [])

  if (!mounted) return null

  return <Analytics />
}
