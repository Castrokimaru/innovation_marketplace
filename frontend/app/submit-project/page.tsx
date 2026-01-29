'use client'

import React from "react"

import { useState } from 'react'
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

const CATEGORIES = [
  'HealthTech',
  'EdTech',
  'FinTech',
  'AgriTech',
  'SaaS',
  'E-Commerce',
  'AI/ML',
  'Real Estate',
]

const TECHNOLOGIES = [
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'Flutter',
  'Mobile',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'Firebase',
  'TypeScript',
  'Vue',
]

export default function SubmitProjectPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    technologies: [] as string[],
    liveLink: '',
    githubLink: '',
    videoLink: '',
    teamMembers: [''],
  })

  const [selectedTechs, setSelectedTechs] = useState<string[]>([])

  const handleAddTech = (tech: string) => {
    if (!selectedTechs.includes(tech)) {
      setSelectedTechs([...selectedTechs, tech])
    }
  }

  const handleRemoveTech = (tech: string) => {
    setSelectedTechs(selectedTechs.filter((t) => t !== tech))
  }

  const handleAddTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, ''],
    })
  }

  const handleRemoveTeamMember = (index: number) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== index),
    })
  }

  const handleUpdateTeamMember = (index: number, value: string) => {
    const newMembers = [...formData.teamMembers]
    newMembers[index] = value
    setFormData({
      ...formData,
      teamMembers: newMembers,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ ...formData, technologies: selectedTechs })
    alert('Project submitted successfully!')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Submit Your Project</h1>
            <p className="text-lg text-foreground/60">
              Share your capstone project with the Moringa community and the world
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <Card className="p-8 space-y-6">
                <h2 className="text-2xl font-bold">Project Information</h2>

                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., HealthTech Appointment System"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief one-line summary of your project"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Full Description *</Label>
                  <Textarea
                    id="longDescription"
                    placeholder="Detailed description including features, problem solved, and impact"
                    rows={6}
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    required
                  />
                </div>
              </Card>

              {/* Technologies */}
              <Card className="p-8 space-y-6">
                <h2 className="text-2xl font-bold">Technologies Used</h2>

                <div className="space-y-4">
                  <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    {TECHNOLOGIES.map((tech) => (
                      <Button
                        key={tech}
                        type="button"
                        variant={selectedTechs.includes(tech) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleAddTech(tech)}
                        className={selectedTechs.includes(tech) ? 'bg-primary' : ''}
                      >
                        {tech}
                      </Button>
                    ))}
                  </div>

                  {selectedTechs.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
                      {selectedTechs.map((tech) => (
                        <Badge key={tech} className="bg-primary text-sm">
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(tech)}
                            className="ml-2 hover:opacity-70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Links */}
              <Card className="p-8 space-y-6">
                <h2 className="text-2xl font-bold">Project Links</h2>

                <div className="space-y-2">
                  <Label htmlFor="liveLink">Live Demo Link</Label>
                  <Input
                    id="liveLink"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.liveLink}
                    onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubLink">GitHub Repository *</Label>
                  <Input
                    id="githubLink"
                    type="url"
                    placeholder="https://github.com/your-repo"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoLink">Demo Video Link</Label>
                  <Input
                    id="videoLink"
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={formData.videoLink}
                    onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                  />
                </div>
              </Card>

              {/* Team Members */}
              <Card className="p-8 space-y-6">
                <h2 className="text-2xl font-bold">Team Members</h2>

                <div className="space-y-3">
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Team member name"
                        value={member}
                        onChange={(e) => handleUpdateTeamMember(index, e.target.value)}
                        required
                      />
                      {formData.teamMembers.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveTeamMember(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTeamMember}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </Card>

              {/* Media */}
              <Card className="p-8 space-y-6">
                <h2 className="text-2xl font-bold">Project Media</h2>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Upload project screenshots or thumbnail</p>
                    <p className="text-sm text-foreground/60">Drag and drop or click to select</p>
                  </div>
                  <Button type="button" variant="outline">
                    Choose Files
                  </Button>
                </div>
              </Card>

              {/* Submit */}
              <div className="flex gap-4 justify-end">
                <Button variant="outline" type="reset">
                  Clear Form
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-base px-8">
                  Submit Project
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
