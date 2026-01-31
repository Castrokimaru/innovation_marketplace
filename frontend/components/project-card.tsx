'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface ProjectCardProps {
  id: number
  title: string
  description: string
  image?: string
  technologies: string[]
  category: string
  author: string
  views?: number
  rating?: number
}

export function ProjectCard({
  id,
  title,
  description,
  image,
  technologies,
  category,
  author,
  views = 0,
  rating = 0,
}: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
          <Link href={`/projects/${id}`} className="group/link block">
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
          {image ? (
            <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-4xl">💻</span>
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg group-hover/link:text-primary transition">
                {title}
              </h3>
              <p className="text-sm text-foreground/60 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 flex-1">
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-secondary/10">
            {category}
          </Badge>
          {technologies.slice(0, 2).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-foreground/60">
          <span className="font-medium">{author}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {views}
            </span>
            <span>⭐ {rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={(e) => e.stopPropagation()}>
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={(e) => e.stopPropagation()}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Link href={`/projects/${id}`} className="ml-2">
            <Button size="sm" className="bg-primary text-white">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
