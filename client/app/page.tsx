'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { mockProjects, mockCategories } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredProjects = mockProjects.filter((p) => p.status === 'approved').slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Innovate with us!
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Discover groundbreaking student projects, submit your innovative ideas, and join our community of creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects">
              <Button size="lg" className="w-full sm:w-auto">
                View Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/projects?submit=true">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Submit Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full p-6 hover:shadow-lg transition cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded mb-4 flex items-center justify-center">
                    <div className="text-4xl">📽️</div>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {project.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {mockCategories.map((category) => (
              <Link key={category.id} href={`/projects?category=${category.id}`}>
                <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                  <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-primary text-primary-foreground rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-lg mb-8 opacity-90">
            Check out our exclusive Moringa Innovation merchandise collection.
          </p>
          <Link href="/merchandise">
            <Button variant="secondary" size="lg">
              Browse Merchandise
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Moringa School Innovation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
