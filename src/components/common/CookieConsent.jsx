import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'alfa_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-xl md:border">
      <p className="mb-3 text-sm text-gray-600">
        We use cookies to improve your experience. By continuing, you agree to our{' '}
        <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link>.
      </p>
      <div className="flex gap-2">
        <Button onClick={accept} size="sm" className="bg-primary text-white">Accept</Button>
        <Button onClick={decline} size="sm" variant="outline">Decline</Button>
      </div>
    </div>
  )
}
