import type { Metadata } from 'next'
import { TestimonialsManager } from '@/components/admin/testimonials/TestimonialsManager'
import { requireAdmin } from '@/lib/auth'
import { getTestimonials } from '@/lib/data'

export const metadata: Metadata = { title: 'Testimonials' }

export default async function TestimonialsPage({ searchParams }: PageProps<'/admin/testimonials'>) {
  await requireAdmin()
  const [testimonials, params] = await Promise.all([getTestimonials(), searchParams])
  return <TestimonialsManager testimonials={testimonials} openNew={params.new === '1'} />
}
