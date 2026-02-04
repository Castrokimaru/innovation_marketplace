'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Heart, Share2, Github, Globe, Calendar, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
import { PROJECTS } from '@/lib/projects'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id

  interface Project {
    id: number
    title: string
    description: string
    longDescription: string
    category: string
    status: string
    createdAt: string
    teamSize: number
    rating: number
    reviews: number
    technologies: string[]
    liveLink?: string
    githubLink?: string
    teamMembers: string[]
    views: number
  }

  const project: Project | undefined = PROJECTS.find((p) => p.id === parseInt(projectId as string)) as Project | undefined

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h2 className="text-2xl font-bold">Project not found</h2>
            <p className="text-foreground/60 mt-2">The project you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <div className="inline-flex gap-2">
                  <Badge className="bg-primary">{project.category}</Badge>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                <h1 className="text-5xl font-bold">{project.title}</h1>
                <p className="text-xl text-foreground/60">{project.description}</p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground/60">
                      Launched {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground/60">{project.teamSize} team members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground/60">⭐ {project.rating} ({project.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <Card className="p-6 space-y-4">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center text-6xl">
                  💻
                </div>
                <div className="space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Heart className="mr-2 h-4 w-4" />
                    Save Project
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-8">
                {/* About */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">About This Project</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground/70 whitespace-pre-line">{project.longDescription}</p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Technologies Used</h2>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="bg-secondary/20">
                        {tech}
                      </Badge>
                    ))} 
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Explore the Project</h2>
                  <div className="flex gap-4">
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Globe className="mr-2 h-4 w-4" />
                        View Live Demo
                      </Button>
                    </a>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub Repository
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Team */}
                <Card className="p-6 space-y-4">
                  <h3 className="font-bold text-lg">Development Team</h3>
                  <div className="space-y-3">
                    {project.teamMembers.map((member: string) => (
                      <div key={member} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                          {member.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{member}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>


              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
