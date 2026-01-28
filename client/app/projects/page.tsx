'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockProjects, mockCategories } from '@/lib/mock-data';
import { ChevronDown } from 'lucide-react';

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    searchParams.get('status')
  );

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchCategory = !selectedCategory || 
        mockProjects.some(p => p.id === project.id && selectedCategory); // Simplified for mock
      const matchStatus = !selectedStatus || project.status === selectedStatus;
      return matchCategory && matchStatus;
    });
  }, [selectedCategory, selectedStatus]);

  const statusOptions = Array.from(new Set(mockProjects.map((p) => p.status)));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Browse all student innovation projects
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-secondary/30 p-6 rounded-lg">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Filter: Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-4 py-2 rounded border border-input bg-background appearance-none cursor-pointer text-foreground"
              >
                <option value="">All Categories</option>
                {mockCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Filter: Status
            </label>
            <div className="relative">
              <select
                value={selectedStatus || ''}
                onChange={(e) => setSelectedStatus(e.target.value || null)}
                className="w-full px-4 py-2 rounded border border-input bg-background appearance-none cursor-pointer text-foreground"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedCategory || selectedStatus) && (
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedStatus(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">No projects found matching your filters.</p>
            </Card>
          ) : (
            filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="p-6 hover:shadow-lg transition cursor-pointer">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Project Image */}
                    <div className="w-full sm:w-48 aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded flex-shrink-0 flex items-center justify-center">
                      <div className="text-4xl">📽️</div>
                    </div>

                    {/* Project Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                          project.status === 'approved'
                            ? 'bg-accent/20 text-accent-foreground'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>

                      {/* Technologies */}
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Tech:</span> {project.technologies}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                          Submitted by: <span className="text-foreground font-semibold">{project.submitted_name}</span>
                        </p>
                        <Button variant="ghost" className="text-primary hover:bg-primary/10 justify-start sm:justify-end">
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
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
