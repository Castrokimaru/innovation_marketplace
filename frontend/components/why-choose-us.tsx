'use client'

import { Shield, Clock, DollarSign, BookOpen, Award, Smartphone } from 'lucide-react'

export function WhyChooseUs() {
  const features = [
  {
    title: 'Fast Connections',
    description: 'Connect with recruiters and collaborators in hours, not weeks.',
    icon: Clock,
  },
  {
    title: 'Secure Platform',
    description: 'Enterprise-grade security for your data and intellectual work.',
    icon: Shield,
  },
  {
    title: 'Free to Start',
    description: 'No upfront costs to showcase projects or explore talent.',
    icon: DollarSign,
  },
]


  return (
    <section className="py-28 bg-primary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
       
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose Our Marketplace
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built to help students turn ideas into opportunities — faster, safer, and without barriers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                group relative rounded-2xl p-8
                bg-background/70 backdrop-blur
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
                hover:shadow-primary/20
              "
            >
              
              <div className="
                mb-6 flex h-14 w-14 items-center justify-center
                rounded-xl bg-primary/10
                text-primary
                transition-colors
                group-hover:bg-primary group-hover:text-white
              ">
                <feature.icon className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              
              <span className="
                pointer-events-none absolute inset-0 rounded-2xl
                ring-1 ring-transparent
                group-hover:ring-primary/30
                transition
              " />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}