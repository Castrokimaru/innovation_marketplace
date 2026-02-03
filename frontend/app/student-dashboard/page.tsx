'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
      return
    }
    if (session.user.role !== 'student') {
      router.push('/auth/signin') // Or appropriate redirect
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'student') {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        <p>Welcome, {session.user.username}! This is your student dashboard.</p>
        {/* Add student-specific content here */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
          {/* List student's projects */}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Submit New Project</h2>
          <p>Submit your innovative projects here.</p>
          {/* Link to submit project page */}
        </div>
      </main>
      <Footer />
    </div>
  )
}