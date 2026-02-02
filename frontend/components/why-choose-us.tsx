'use client'

import { Shield, Clock, DollarSign, BookOpen, Award, Smartphone } from 'lucide-react'

export function WhyChooseUs() {
  const features = [
    {
      title: 'Secure Platform',
      description: 'Your data and projects are protected with enterprise-grade security.',
      icon: Shield,
    },
    {
      title: 'Quick Connections',
      description: 'Find opportunities and talent within hours, not weeks.',
      icon: Clock,
    },
    {
      title: 'Free to Start',
      description: 'No upfront costs to join and showcase your innovations.',
      icon: DollarSign,
    },
    {
      title: 'Learning Resources',
      description: 'Access mentorship and training to accelerate your growth.',
      icon: BookOpen,
    },
    {
      title: 'Recognition',
      description: 'Get featured and recognized for your innovative work.',
      icon: Award,
    },
    {
      title: 'Easy Access',
      description: 'Mobile-friendly platform accessible anywhere, anytime.',
      icon: Smartphone,
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-70"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-white/20"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-black mb-4">Why Choose Our Marketplace?</h2>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto">
            Designed for students and recruiters to foster innovation and career growth.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
              <p className="text-gray-800">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}