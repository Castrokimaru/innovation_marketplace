'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, Plus, X } from 'lucide-react'
import Autocomplete from '@/components/ui/autocomplete'
import { createProject } from '@/lib/api'

const CATEGORIES = [
  'HealthTech', 'EdTech', 'FinTech', 'AgriTech',
  'SaaS', 'E-Commerce', 'AI/ML', 'Real Estate',
]

const TECHNOLOGIES = [
  'React', 'Next.js', 'Node.js', 'Python', 'Flutter',
  'Mobile', 'PostgreSQL', 'MongoDB', 'AWS', 'Firebase',
  'TypeScript', 'Vue',
]

// Known users mock
const KNOWN_USERS = [
  'Alice Johnson','Bob Smith','Carol Davis','Daniel Otieno',
  'Emily Wanjiru','Faith Njeri','George Kamau'
]

interface FormData {
  title: string
  description: string
  longDescription: string
  category: string
  technologies: string[]
  liveLink: string
  githubLink: string
  videoLink: string
  teamMembers: string[]
}

export default function SubmitProjectPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    technologies: [],
    liveLink: '',
    githubLink: '',
    videoLink: '',
    teamMembers: [''],
  })
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleAddTech = (tech: string) => {
    if (!selectedTechs.includes(tech)) setSelectedTechs([...selectedTechs, tech])
  }

  const handleRemoveTech = (tech: string) => {
    setSelectedTechs(selectedTechs.filter(t => t !== tech))
  }

  const handleAddTeamMember = () => {
    setFormData({ ...formData, teamMembers: [...formData.teamMembers, ''] })
  }

  const handleRemoveTeamMember = (index: number) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== index),
    })
  }

  const handleUpdateTeamMember = (index: number, value: string) => {
    const members = [...formData.teamMembers]
    members[index] = value
    setFormData({ ...formData, teamMembers: members })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Check session and accessToken
    if (!session?.accessToken) {
      window.location.href = '/auth/signin'
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        video: formData.videoLink,
        technologies: selectedTechs,
        submitted_name: session.user?.username || session.user?.email || 'Anonymous',
        team_members: formData.teamMembers,
        category_ids: [], // map category names to IDs if needed
      }
      await createProject(payload, session.accessToken)
      alert('Project submitted successfully! It will appear after approval.')
      window.location.href = '/projects'
    } catch (err: any) {
      alert(err.message || 'Failed to submit project')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Submit Your Project</h1>
          <p className="text-lg text-foreground/60 mb-8">
            Share your capstone project with the Moringa community and the world
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Info */}
            <Card className="p-8 space-y-6">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={value => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />

              <Label htmlFor="longDescription">Full Description *</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                required
              />
            </Card>

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
