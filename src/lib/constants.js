export const USER_ROLES = ['super_admin', 'admin', 'hr', 'sales', 'editor']

export const PRODUCT_CATEGORIES = [
  { value: 'passenger', label: 'Passenger', icon: 'Users' },
  { value: 'freight', label: 'Freight', icon: 'Package' },
  { value: 'home', label: 'Home Lift', icon: 'Home' },
  { value: 'hospital', label: 'Hospital', icon: 'HeartPulse' },
  { value: 'dumbwaiter', label: 'Dumbwaiter', icon: 'UtensilsCrossed' },
  { value: 'escalator', label: 'Escalator', icon: 'ArrowUpDown' },
  { value: 'car', label: 'Car Lift', icon: 'Car' },
]

export const ELEVATOR_TYPES = [
  'Passenger',
  'Freight',
  'Home',
  'Hospital',
  'Dumbwaiter',
  'Escalator',
]

export const BUILDING_TYPES = [
  'Residential',
  'Commercial',
  'Hospital',
  'Industrial',
  'Mall',
  'Hotel',
]

export const JOB_DEPARTMENTS = [
  { value: 'technical', label: 'Technical' },
  { value: 'hr', label: 'HR' },
  { value: 'sales', label: 'Sales' },
  { value: 'admin', label: 'Admin' },
  { value: 'operations', label: 'Operations' },
]

export const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
]

export const QUOTE_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'closed', label: 'Closed' },
  { value: 'lost', label: 'Lost' },
]

export const CONTACT_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
]

export const APPLICATION_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
]

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products', hasDropdown: 'products' },
  { label: 'Services', href: '/services', hasDropdown: 'services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

export const FOOTER_LINKS = {
  products: [
    { label: 'Passenger Elevators', href: '/products?category=passenger' },
    { label: 'Home Lifts', href: '/products?category=home' },
    { label: 'Freight Elevators', href: '/products?category=freight' },
    { label: 'Hospital Lifts', href: '/products?category=hospital' },
    { label: 'Escalators', href: '/products?category=escalator' },
  ],
  services: [
    { label: 'Installation', href: '/services/installation' },
    { label: 'Maintenance & AMC', href: '/services/maintenance-amc' },
    { label: 'Modernization', href: '/services/modernization' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export const DEFAULT_OG_IMAGE = '/og-image.jpg'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AlfaFuji Elevator India Pvt Ltd'
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://alfafujielevator.vercel.app/'
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '917902512987'

export const STORAGE_BUCKETS = {
  products: 'products',
  projects: 'projects',
  blogs: 'blogs',
  testimonials: 'testimonials',
  clients: 'clients',
  companyAssets: 'company-assets',
  resumes: 'resumes',
}

export const ADMIN_NAV = {
  super_admin: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Products', href: '/admin/products', icon: 'Package' },
    { label: 'Services', href: '/admin/services', icon: 'Wrench' },
    { label: 'Projects', href: '/admin/projects', icon: 'Building2' },
    { label: 'Blog', href: '/admin/blog', icon: 'BookOpen' },
    { label: 'Testimonials', href: '/admin/testimonials', icon: 'MessageSquare' },
    { label: 'Clients', href: '/admin/clients', icon: 'Users' },
    { label: 'Process Steps', href: '/admin/process-steps', icon: 'ListOrdered' },
    { label: 'Site Settings', href: '/admin/settings', icon: 'Settings' },
    { label: 'User Management', href: '/admin/users', icon: 'UserCog' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Products', href: '/admin/products', icon: 'Package' },
    { label: 'Services', href: '/admin/services', icon: 'Wrench' },
    { label: 'Projects', href: '/admin/projects', icon: 'Building2' },
    { label: 'Blog', href: '/admin/blog', icon: 'BookOpen' },
    { label: 'Testimonials', href: '/admin/testimonials', icon: 'MessageSquare' },
    { label: 'Clients', href: '/admin/clients', icon: 'Users' },
    { label: 'Process Steps', href: '/admin/process-steps', icon: 'ListOrdered' },
    { label: 'Site Settings', href: '/admin/settings', icon: 'Settings' },
  ],
  hr: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Job Openings', href: '/admin/careers', icon: 'Briefcase' },
    { label: 'Applications', href: '/admin/applications', icon: 'FileText' },
  ],
  sales: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Quote Inquiries', href: '/admin/quotes', icon: 'FileText' },
    { label: 'Contact Inquiries', href: '/admin/contacts', icon: 'Mail' },
  ],
  editor: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Blog', href: '/admin/blog', icon: 'BookOpen' },
  ],
}

export const GST_NUMBER = '27AABCA1234A1Z5'
export const CIN_NUMBER = 'U45200MH2010PTC123456'
