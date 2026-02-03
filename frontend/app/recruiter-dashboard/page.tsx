'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function RecruiterDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
      return
    }
    if (session.user.role !== 'recruiter') {
      router.push('/auth/signin') // Or appropriate redirect
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'recruiter') {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
        <p>Welcome, {session.user.username}! This is your recruiter dashboard.</p>
        {/* Add recruiter-specific content here */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Browse Student Projects</h2>
          <p>Discover innovative projects from talented students.</p>
          {/* List projects or link to projects page */}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Talent Search</h2>
          <p>Find and connect with promising students.</p>
          {/* Link to talents page */}
        </div>
      </main>
      <Footer />
    </div>
  )
}