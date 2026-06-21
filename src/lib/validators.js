import { z } from 'zod'

const indianPhone = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')

export const QuoteFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: indianPhone,
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  elevator_type: z.enum([
    'Passenger',
    'Freight',
    'Home',
    'Hospital',
    'Pneumatic',
    'MRL',
    'Panoramic',
    'Platform',
    'Cargo',
    'Car',
    'Chair',
    'Scissor',
    'Dumbwaiter',
    'Escalator',
  ], {
    required_error: 'Select an elevator type',
  }),
  num_floors: z.coerce.number().min(2, 'Minimum 2 floors').max(100, 'Maximum 100 floors'),
  building_type: z.enum(['Residential', 'Commercial', 'Hospital', 'Industrial', 'Mall', 'Hotel'], {
    required_error: 'Select a building type',
  }),
  message: z.string().optional(),
})

export const ContactFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

export const JobApplicationSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: indianPhone,
  cover_letter: z.string().optional(),
  resume: z
    .instanceof(File, { message: 'Resume is required' })
    .refine((file) => file.size <= 8 * 1024 * 1024, 'File must be less than 8MB')
    .refine(
      (file) =>
        ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
          file.type
        ),
      'Only PDF or DOCX files are allowed'
    ),
})

export const ProductFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  category: z.enum(['passenger', 'freight', 'home', 'hospital', 'dumbwaiter', 'escalator', 'car', 'pneumatic', 'mrl', 'panoramic', 'platform', 'cargo', 'chair', 'scissor']),
  short_description: z.string().optional(),
  description: z.string().optional(),
  specifications: z.record(z.string()).optional(),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  brochure_url: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().default(0),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
})

export const BlogFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(2, 'Slug is required'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  cover_image: z.string().url('Cover image is required'),
  read_time_mins: z.coerce.number().default(5),
  is_published: z.boolean().default(false),
  seo_title: z.string().max(60, 'SEO title max 60 characters').optional(),
  seo_description: z.string().max(160, 'SEO description max 160 characters').optional(),
})

export const JobFormSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  department: z.enum(['technical', 'hr', 'sales', 'admin', 'operations']),
  location: z.string().optional(),
  job_type: z.enum(['full_time', 'part_time', 'contract', 'internship']).default('full_time'),
  experience_years: z.string().optional(),
  salary_range: z.string().optional(),
  description: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  deadline: z.string().optional(),
  is_active: z.boolean().default(true),
})

export const ServiceFormSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  short_description: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  banner_image: z.string().optional(),
  key_features: z.array(z.string()).default([]),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
})

export const ProjectFormSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  client_name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  elevator_type: z.string().optional(),
  num_elevators: z.coerce.number().optional(),
  completion_date: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
})

export const LoginFormSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const TestimonialFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
  role: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).default(5),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  photo_url: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().default(0),
})

export const ClientFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  logo_url: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
})

export const ProcessStepFormSchema = z.object({
  step_number: z.coerce.number().min(1),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  icon_name: z.string().optional(),
  is_active: z.boolean().default(true),
})

export const SiteSettingsSchema = z.object({
  company_name: z.string().min(2),
  tagline: z.string().optional(),
  phones: z.array(z.string()).default([]),
  emails: z.array(z.string()).default([]),
  addresses: z.array(z.object({
    label: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    maps_url: z.string().optional(),
  })).default([]),
  social_links: z.record(z.string()).default({}),
  hero_content: z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    cta_text: z.string().optional(),
  }).default({}),
  seo_defaults: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    og_image: z.string().optional(),
  }).default({}),
  stats: z.object({
    years: z.coerce.number().optional(),
    projects: z.coerce.number().optional(),
    clients: z.coerce.number().optional(),
    cities: z.coerce.number().optional(),
  }).default({}),
  whatsapp_number: z.string().optional(),
  google_maps_embed: z.string().optional(),
})
