import { strapiClient } from '../../lib/strapi/client'
import { useEffect, useState } from 'react'

interface Testimonial {
  id: number
  name: string
  title: string
  company: string
  quote: string
  link?: string
}

interface TestimonialCarouselData {
  id: number
  title: string
  subtitle?: string
  layout: string
  max_items?: number
  testimonials?: Testimonial[]
}

interface TestimonialCarouselSectionProps {
  data: TestimonialCarouselData
  locale: 'id' | 'en'
}

// Server-side component that fetches testimonials
export async function TestimonialCarouselSection({ data, locale }: TestimonialCarouselSectionProps) {
  const { title, subtitle, layout, max_items } = data

  // Fetch testimonials from the API
  let testimonials: Testimonial[] = []
  
  try {
    const response = await fetch('http://localhost:1337/api/testimonials')
    const testimonialData = await response.json()
    testimonials = testimonialData.data || []
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
  }

  const displayedTestimonials = max_items ? testimonials.slice(0, max_items) : testimonials

  return (
    <section className="container-fluid py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="font-semibold mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {testimonials && testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-card p-8 rounded-lg border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <blockquote className="text-muted-foreground mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              
              <div>
                <div className="font-semibold text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.title}, {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {locale === 'id' 
              ? 'Testimoni sedang dalam proses pengembangan.' 
              : 'Testimonials are currently in development.'
            }
          </p>
        </div>
      )}
    </section>
  )
}