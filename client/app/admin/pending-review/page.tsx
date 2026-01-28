'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockProjects } from '@/lib/mock-data';
import { Check, X, Eye } from 'lucide-react';
import Link from 'next/link';

export default function PendingReviewPage() {
  const [reviewedProjects, setReviewedProjects] = useState<number[]>([]);
  const pendingProjects = mockProjects.filter((p) => p.status === 'pending');

  const handleApprove = (projectId: number) => {
    setReviewedProjects((prev) => [...prev, projectId]);
  };

  const handleReject = (projectId: number) => {
    setReviewedProjects((prev) => [...prev, projectId]);
  };

  const remainingReviews = pendingProjects.filter((p) => !reviewedProjects.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Pending Project Reviews</h1>
          <p className="text-muted-foreground">
            Review and approve student projects before publication
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Total Pending</p>
            <p className="text-3xl font-bold text-foreground">{pendingProjects.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Reviewed</p>
            <p className="text-3xl font-bold text-primary">{reviewedProjects.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Remaining</p>
            <p className="text-3xl font-bold text-accent">{remainingReviews.length}</p>
          </Card>
        </div>

        {/* Projects to Review */}
        {remainingReviews.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              {pendingProjects.length === 0
                ? 'No pending projects'
                : 'All projects have been reviewed!'}
            </p>
            {pendingProjects.length > 0 && reviewedProjects.length > 0 && (
              <Button
                onClick={() => setReviewedProjects([])}
                variant="outline"
              >
                Reset Reviews
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {remainingReviews.map((project) => (
              <Card key={project.id} className="p-8 border-2 border-yellow-200 bg-yellow-50/30">
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground font-semibold mb-2">
                          Technologies
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.split(', ').map((tech, i) => (
                            <Badge key={i} variant="secondary" className="bg-secondary/50">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/30 p-4 rounded">
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold">
                            Submitted by
                          </p>
                          <p className="text-foreground font-semibold">
                            {project.submitted_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold">
                            Submission Date
                          </p>
                          <p className="text-foreground font-semibold">
                            {project.created_at.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Video Preview */}
                    <div className="w-full sm:w-56 flex-shrink-0">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center">
                        <div className="text-4xl">📽️</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-t border-border pt-6">
                  <Link href={`/projects/${project.id}`} target="_blank">
                    <Button variant="outline" className="w-full sm:w-auto gap-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      View Full Project
                    </Button>
                  </Link>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      onClick={() => handleReject(project.id)}
                      variant="outline"
                      className="flex-1 sm:flex-none gap-2 border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(project.id)}
                      className="flex-1 sm:flex-none gap-2 bg-accent hover:bg-accent/90"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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
