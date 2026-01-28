'use client';

import { mockProjects } from '@/lib/mock-data';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailsPage({ params }: ProjectPageProps) {
  const project = mockProjects.find((p) => p.id === parseInt(params.id));

  if (!project) {
    notFound();
  }

  const technologies = project.technologies.split(', ');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Video Section */}
        <div className="mb-8">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={project.video}
              title={project.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Project Title and Status */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-4xl font-bold text-foreground">{project.title}</h1>
            <Badge
              className={`px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                project.status === 'approved'
                  ? 'bg-accent/20 text-accent-foreground'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-2 bg-secondary/50 text-foreground"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-secondary/30 rounded p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Project Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold">Submitted by</p>
                    <p className="text-foreground text-lg">{project.submitted_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold">Submission Date</p>
                    <p className="text-foreground text-lg">
                      {project.created_at.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-20">
              <h3 className="text-lg font-bold text-foreground mb-6">Project Status</h3>
              <div className="mb-6 p-4 bg-secondary/30 rounded">
                <p className="text-sm text-muted-foreground font-semibold mb-2">Status</p>
                <p className={`text-xl font-bold ${
                  project.status === 'approved'
                    ? 'text-accent-foreground'
                    : 'text-yellow-800'
                }`}>
                  {project.status.toUpperCase()}
                </p>
              </div>

              <Link href="/projects" className="w-full">
                <Button variant="outline" className="w-full mb-3 bg-transparent">
                  Back to Projects
                </Button>
              </Link>
              <Button className="w-full">
                Share Project
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground/5 py-8 px-4 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Moringa School Innovation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
