'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

import { Loader2, ArrowLeft, Save, User2, Shield } from 'lucide-react'
import { updateProfile } from '@/lib/api'

type FormState = {
  first_name: string
  last_name: string
  new_password: string
}

export default function StudentProfileClient() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'student') router.replace('/auth/signin')
  }, [session, status, router])

  const token = session?.accessToken

  const initial = useMemo<FormState>(() => {
    const u: any = session?.user
    return {
      first_name: u?.first_name ?? '',
      last_name: u?.last_name ?? '',
      new_password: '',
    }
  }, [session])

  const [form, setForm] = useState<FormState>(initial)
  const [saving, setSaving] = useState(false)

  useEffect(() => setForm(initial), [initial])

  const canSave = form.first_name.trim() && form.last_name.trim()

  const isDirty = useMemo(() => {
    return (
      form.first_name !== initial.first_name ||
      form.last_name !== initial.last_name ||
      form.new_password.trim().length > 0
    )
  }, [form, initial])

  const onChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }))

  const onCancel = () => {
    setForm(initial)
    toast({ title: 'Changes discarded' })
  }

  const onSave = async () => {
    setSaving(true)
    try {
      const payload: any = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
      }
      if (form.new_password.trim()) payload.password = form.new_password.trim()

      const result = await updateProfile(payload, token)

      await update({
        user: {
          ...(session?.user as any),
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          email: result.user.email,
        },
      } as any)

      setForm((p) => ({ ...p, new_password: '' }))

      toast({ title: result.message || 'Profile updated' })
    } catch (e: any) {
      toast({
        title: 'Update failed',
        description: e?.message ?? 'Could not update profile',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto max-w-3xl px-4 py-10">
          <div className="h-8 w-72 rounded bg-muted animate-pulse" />
          <div className="mt-6 h-64 rounded bg-muted animate-pulse" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!session || session.user.role !== 'student') return null

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-foreground/70">Update your personal info and security settings.</p>
            <Badge variant="secondary">{isDirty ? 'Unsaved changes' : 'Up to date'}</Badge>
          </div>

          <div className="flex gap-3">
            <Link href="/student-dashboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>

            <Button onClick={onSave} disabled={!canSave || saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>

        <Card className="mt-8 p-6">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <User2 className="h-4 w-4" />
            <span className="font-medium">Personal information</span>
          </div>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input id="first_name" value={form.first_name} onChange={onChange('first_name')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" value={form.last_name} onChange={onChange('last_name')} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email (read-only)</Label>
              <Input id="email" value={session.user.email ?? ''} readOnly />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-foreground/70">
            <Shield className="h-4 w-4" />
            <span className="font-medium">Security</span>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="new_password">New password (optional)</Label>
            <Input
              id="new_password"
              type="password"
              value={form.new_password}
              onChange={onChange('new_password')}
              placeholder="Leave blank to keep current password"
            />
            <p className="text-xs text-foreground/60">
              Backend currently accepts only <code>password</code> (no current password check).
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <p className="text-sm text-foreground/60">Changes apply immediately after saving.</p>
            <Button variant="outline" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
