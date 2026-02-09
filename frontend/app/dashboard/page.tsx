import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardRouter() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/signin')

  const role = session.user.role

  if (role === 'student') redirect('/student-dashboard')
  if (role === 'recruiter') redirect('/recruiter-dashboard')

  redirect('/admin')
}
