'use client'

import { CheckCircle, Users, Lightbulb, TrendingUp } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up as a student or recruiter and build your profile to showcase your skills or requirements.',
      icon: Users,
    },
    {
      number: '02',
      title: 'Submit or Browse Projects',
      description: 'Students submit innovative projects, recruiters browse and connect with talent.',
      icon: Lightbulb,
    },
    {
      number: '03',
      title: 'Connect and Collaborate',
      description: 'Build partnerships, get feedback, and turn ideas into successful ventures.',
      icon: TrendingUp,
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-70"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-white/20"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-black mb-4">How It Works</h2>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto">
            Get started in three simple steps and join the innovation community.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">{step.title}</h3>
              <p className="text-gray-800">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}