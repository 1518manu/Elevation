import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLoader from '@/components/common/PageLoader'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/admin', { replace: true }), 1500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <PageLoader />
      <p className="mt-4 text-sm text-gray-500">Completing sign in...</p>
    </div>
  )
}
