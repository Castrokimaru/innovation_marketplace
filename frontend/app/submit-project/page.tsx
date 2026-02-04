'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

import { createProject, type CreateProjectPayload } from '@/lib/api'

const CATEGORY_OPTIONS = ['HealthTech', 'EdTech', 'FinTech', 'AgriTech', 'Other'] as const

function parseTechnologies(raw: string): string[] {
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}

const schema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(50, 'Max 50 characters'),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Max 500 characters'),
  video: z
    .string()
    .trim()
    .min(8, 'Video is required')
    .refine((v) => /^https?:\/\/.+/i.test(v), 'Video must be a valid URL (https://...)'),
  technologies: z.string().trim().min(2, 'Technologies is required (e.g. React, Flask)'),
  category: z.enum(CATEGORY_OPTIONS).optional(), 
})

type FormValues = z.infer<typeof schema>

export default function SubmitProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()

  const token = session?.accessToken
  const DASHBOARD_PATH = '/student-dashboard'

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'student') {
      router.replace('/auth/signin')
    }
  }, [session, status, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    title: '',
    description: '',
    video: '',
    technologies: '',
    category: 'Other',
  },
    mode: 'onTouched',
  })

  const techPreview = useMemo(() => parseTechnologies(watch('technologies') || ''), [watch])

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      toast({
        title: 'Session expired',
        description: 'Please sign in again.',
        variant: 'destructive',
      })
      router.replace('/auth/signin')
      return
    }

    const submitted_name =
      (session?.user as any)?.username ||
      (session?.user as any)?.email ||
      'Student'

    const payload: CreateProjectPayload = {
        title: values.title.trim(),
        description: values.description.trim(),
        video: values.video.trim(),
        technologies: values.technologies.trim(),
        submitted_name,
        team_members: [],
        category_ids: [],
    }

    try {
      await createProject(payload, token)

      toast({
        title: 'Project submitted',
        description: 'Your project was created successfully.',
      })

      reset() 
      router.replace(DASHBOARD_PATH)
      router.refresh()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong.'
      toast({
        title: 'Submission failed',
        description: message,
        variant: 'destructive',
      })
    }
  }

  if (status === 'loading') return null
  if (!session || session.user.role !== 'student') return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-4">
<div>
          <h1 className="text-3xl font-bold">Submit Project</h1>
          <p className="text-foreground/70">All fields are required.</p>
          </div>
          <Badge variant="secondary">{isSubmitting ? 'Submitting…' : 'Ready'}</Badge>
        </div>

        <Card className="mt-6 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="e.g. Innovation Marketplace" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full min-h-[120px] rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="What does your project do? Who is it for? What problem does it solve?"
                {...register('description')}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            {/* Video */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Demo Video URL</label>
              <Input placeholder="https://youtube.com/..." {...register('video')} />
              {errors.video && <p className="text-sm text-destructive">{errors.video.message}</p>}
            </div>

            {/* Category (UI-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (optional)</label>
              <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...register('category')}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Technologies */}
            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Technologies</h2>
              <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                {TECHNOLOGIES.map(tech => (
                  <Button
                    key={tech}
                    type="button"
                    variant={selectedTechs.includes(tech) ? 'default' : 'outline'}
                    onClick={() => handleAddTech(tech)}
                  >
                    {tech}
                  </Button>
                ))}
              </div>
              {selectedTechs.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
                  {selectedTechs.map(tech => (
                    <Badge key={tech} className="bg-primary text-sm">
                      {tech}
                      <button type="button" onClick={() => handleRemoveTech(tech)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            {/* Team Members */}
            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Team Members</h2>
              {formData.teamMembers.map((member, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Autocomplete
                    value={member}
                    onChange={v => handleUpdateTeamMember(idx, v)}
                    options={KNOWN_USERS}
                  />
                  {formData.teamMembers.length > 1 && (
                    <Button type="button" variant="outline" onClick={() => handleRemoveTeamMember(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddTeamMember}>
                <Plus className="h-4 w-4 mr-2" /> Add Team Member
              </Button>
            </Card>

            {/* Links & Media omitted for brevity */}

            <div className="flex gap-4 justify-end">
              <Button type="reset" variant="outline">Clear Form</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Project'}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
