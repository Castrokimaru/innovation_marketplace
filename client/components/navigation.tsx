'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-primary">
           Innovation Marketplace
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition">
              Home
            </Link>
            <Link href="/projects" className="text-foreground hover:text-primary transition">
              Projects
            </Link>
            <Link href="/merchandise" className="text-foreground hover:text-primary transition">
              Merchandise
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition">
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded"
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/merchandise"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded"
              onClick={() => setIsOpen(false)}
            >
              Merchandise
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
