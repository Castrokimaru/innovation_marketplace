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
  technologies?: string[] | string
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
    <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <Link href={`/projects/${id}`} className="block">
        <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-6xl">💻</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 text-primary font-semibold">
              {category}
            </Badge>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-xl group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-foreground/70 line-clamp-3">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(() => {
              const techs = Array.isArray(technologies)
                ? technologies
                : (typeof technologies === 'string' ? technologies.split(',').map(s => s.trim()).filter(Boolean) : [])
              return techs.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs bg-primary/10 border-primary/20">
                  {tech}
                </Badge>
              ))
            })()}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-primary">{author}</span>
            <div className="flex items-center gap-3 text-foreground/60">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {views}
              </span>
              <span className="flex items-center gap-1">
                ⭐ {rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent hover:bg-primary hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent hover:bg-primary hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button size="sm" className="bg-primary text-white hover:bg-primary/90 transition-colors">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  )
}
