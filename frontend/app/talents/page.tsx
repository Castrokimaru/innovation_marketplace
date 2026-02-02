'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Mail, Github, Linkedin } from 'lucide-react'
import { fetchProjects } from '@/lib/api'

const DEFAULT_AVATAR = '👩‍💻'

interface Talent {
  id: string | number
  name: string
  role: string
  email?: string
  avatar: string
  bio: string
  skills: string[]
  projects: number
  rating: number
}

interface Project {
  id: string | number
  team_members?: Array<{
    id: string | number
    first_name: string
    last_name: string
    role?: string
    email?: string
  }>
}

export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const { toast } = useToast()

  // Fetch projects and extract unique talents
  useEffect(() => {
    let mounted = true
    setLoading(true)

    fetchProjects()
      .then((projects: Project[]) => {
        const map: Record<string, Talent> = {}

        projects.forEach((p) => {
          (p.team_members || []).forEach((m) => {
            if (!map[m.id]) {
              map[m.id] = {
                id: m.id,
                name: `${m.first_name} ${m.last_name}`,
                role: m.role || 'Developer',
                email: m.email,
                avatar: DEFAULT_AVATAR,
                bio: '',
                skills: [],
                projects: 0,
                rating: 4.6,
              }
            }
            map[m.id].projects += 1
          })
        })

        if (mounted) setTalents(Object.values(map))
      })
      .catch(() => toast({ title: 'Failed to load talents' }))
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [toast])

  // Filter talents based on search and role
  const filteredTalents = talents.filter((talent) => {
    const matchesSearch =
      talent.name.toLowerCase().includes(search.toLowerCase()) ||
      talent.skills.some((skill: string) => skill.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = filter === 'All' || talent.role === filter
    return matchesSearch && matchesFilter
  })

  const ROLES = [
    'All',
    'Full Stack Developer',
    'Mobile Developer',
    'AI/ML Engineer',
    'DevOps Engineer',
    'Frontend Developer',
    'Backend Developer',
  ]

  function HireDialog({ talent }: { talent: Talent }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    function onSubmit(e?: React.FormEvent) {
      if (e) e.preventDefault()
      if (!talent.email) {
        toast({ title: 'No contact email', description: 'This talent has no contact email available.' })
        return
      }

      const subject = `Hiring: ${talent.name}`
      const body = `${message}\n\nFrom: ${name || 'Anonymous'}\nContact: ${email || 'Not provided'}`
      const mailto = `mailto:${talent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

      if (typeof window !== 'undefined') {
        window.location.href = mailto
        setOpen(false)
        toast({ title: 'Opening email client', description: `Composing message to ${talent.name}` })
      }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-sm">
            <Mail className="h-3 w-3 mr-1" /> Hire
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hire {talent.name}</DialogTitle>
            <DialogDescription>
              Send a short message to express interest. This will open your email client to complete the message.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Your contact email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Textarea placeholder="Message (brief)" value={message} onChange={(e) => setMessage(e.target.value)} />

            <div className="flex items-center justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit">Send</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <main>
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Find Talented Developers</h1>
            <p className="text-lg text-foreground/60">
              Discover and hire talented Moringa students for your next project
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-40 bg-background border-b border-border py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Input
              placeholder="Search by name or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {ROLES.map((role) => (
                <Button
                  key={role}
                  variant={filter === role ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(role)}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Talents Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">Loading talents...</div>
            ) : filteredTalents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTalents.map((talent) => (
                  <Card key={talent.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl">{talent.avatar}</div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-lg">{talent.name}</h3>
                          <p className="text-sm text-primary font-medium">{talent.role}</p>
                          <div className="text-xs text-foreground/60 pt-1">
                            ⭐ {talent.rating} • {talent.projects} projects
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-foreground/60">{talent.bio}</p>

                      <div className="flex flex-wrap gap-2">
                        {talent.skills.map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <HireDialog talent={talent} />
                        <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                          <Github className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-foreground/60 mb-4">No talents found matching your search</p>
                <Button variant="outline" onClick={() => { setSearch(''); setFilter('All') }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
