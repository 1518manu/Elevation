import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/contexts/AuthContext'
import { QuoteModalProvider } from '@/components/common/QuoteModal'
import { Toaster } from '@/components/ui/toast'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import WhatsAppButton from '@/components/common/WhatsAppButton'
import CookieConsent from '@/components/common/CookieConsent'
import AppRouter from '@/router/index'

function AppShell() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname === '/login'

  if (isAdmin) {
    return (
      <>
        <AppRouter />
        <Toaster />
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AppRouter />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <QuoteModalProvider>
              <BrowserRouter>
                <AppShell />
              </BrowserRouter>
            </QuoteModalProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}
