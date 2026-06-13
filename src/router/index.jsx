import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PageLoader from '@/components/common/PageLoader'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import AdminSidebar from '@/components/admin/AdminSidebar'

const HomePage = lazy(() => import('@/pages/public/HomePage'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const ProductsPage = lazy(() => import('@/pages/public/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'))
const ServicesPage = lazy(() => import('@/pages/public/ServicesPage'))
const ServiceDetailPage = lazy(() => import('@/pages/public/ServiceDetailPage'))
const ProjectsPage = lazy(() => import('@/pages/public/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/pages/public/ProjectDetailPage'))
const BlogPage = lazy(() => import('@/pages/public/BlogPage'))
const BlogDetailPage = lazy(() => import('@/pages/public/BlogDetailPage'))
const CareersPage = lazy(() => import('@/pages/public/CareersPage'))
const JobDetailPage = lazy(() => import('@/pages/public/JobDetailPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/public/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('@/pages/public/TermsPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const AuthCallbackPage = lazy(() => import('@/pages/auth/AuthCallbackPage'))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const ProductsAdminPage = lazy(() => import('@/pages/admin/ProductsAdminPage'))
const ServicesAdminPage = lazy(() => import('@/pages/admin/ServicesAdminPage'))
const ProjectsAdminPage = lazy(() => import('@/pages/admin/ProjectsAdminPage'))
const BlogAdminPage = lazy(() => import('@/pages/admin/BlogAdminPage'))
const CareerAdminPage = lazy(() => import('@/pages/admin/CareerAdminPage'))
const ApplicationsAdminPage = lazy(() => import('@/pages/admin/ApplicationsAdminPage'))
const ContactInquiriesPage = lazy(() => import('@/pages/admin/ContactInquiriesPage'))
const QuoteInquiriesPage = lazy(() => import('@/pages/admin/QuoteInquiriesPage'))
const TestimonialsAdminPage = lazy(() => import('@/pages/admin/TestimonialsAdminPage'))
const ClientsAdminPage = lazy(() => import('@/pages/admin/ClientsAdminPage'))
const ProcessStepsAdminPage = lazy(() => import('@/pages/admin/ProcessStepsAdminPage'))
const SiteSettingsPage = lazy(() => import('@/pages/admin/SiteSettingsPage'))
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'))

function PublicLayout({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Suspense fallback={<PageLoader />}>{children}</Suspense>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/products/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
      <Route path="/services/:slug" element={<PublicLayout><ServiceDetailPage /></PublicLayout>} />
      <Route path="/projects" element={<PublicLayout><ProjectsPage /></PublicLayout>} />
      <Route path="/projects/:slug" element={<PublicLayout><ProjectDetailPage /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
      <Route path="/blog/:slug" element={<PublicLayout><BlogDetailPage /></PublicLayout>} />
      <Route path="/careers" element={<PublicLayout><CareersPage /></PublicLayout>} />
      <Route path="/careers/:id" element={<PublicLayout><JobDetailPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
      <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/auth/callback" element={<PublicLayout><AuthCallbackPage /></PublicLayout>} />

      <Route path="/admin" element={<AdminLayout><DashboardPage /></AdminLayout>} />
      <Route path="/admin/products" element={<AdminLayout><ProductsAdminPage /></AdminLayout>} />
      <Route path="/admin/services" element={<AdminLayout><ServicesAdminPage /></AdminLayout>} />
      <Route path="/admin/projects" element={<AdminLayout><ProjectsAdminPage /></AdminLayout>} />
      <Route path="/admin/blog" element={<AdminLayout><BlogAdminPage /></AdminLayout>} />
      <Route path="/admin/blog/:id" element={<AdminLayout><BlogAdminPage /></AdminLayout>} />
      <Route path="/admin/careers" element={<AdminLayout><CareerAdminPage /></AdminLayout>} />
      <Route path="/admin/applications" element={<AdminLayout><ApplicationsAdminPage /></AdminLayout>} />
      <Route path="/admin/contacts" element={<AdminLayout><ContactInquiriesPage /></AdminLayout>} />
      <Route path="/admin/quotes" element={<AdminLayout><QuoteInquiriesPage /></AdminLayout>} />
      <Route path="/admin/testimonials" element={<AdminLayout><TestimonialsAdminPage /></AdminLayout>} />
      <Route path="/admin/clients" element={<AdminLayout><ClientsAdminPage /></AdminLayout>} />
      <Route path="/admin/process-steps" element={<AdminLayout><ProcessStepsAdminPage /></AdminLayout>} />
      <Route path="/admin/settings" element={<AdminLayout><SiteSettingsPage /></AdminLayout>} />
      <Route path="/admin/users" element={<AdminLayout><ProtectedRoute requiredRoles={['super_admin']}><UserManagementPage /></ProtectedRoute></AdminLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
