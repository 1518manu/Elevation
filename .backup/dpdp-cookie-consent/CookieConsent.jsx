import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { X, ChevronDown, ChevronUp, Info } from 'lucide-react'
import {
  getConsent,
  saveConsent,
  updateConsent,
  revokeConsent,
  CookieCategories,
  CookieCategoryDefaults,
  CookieCategoryInfo,
  hasConsent,
} from '@/lib/cookieConsent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showManager, setShowManager] = useState(false)
  const [consents, setConsents] = useState(CookieCategoryDefaults)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    const consent = getConsent()
    if (!consent && initialLoad) {
      setVisible(true)
      setInitialLoad(false)
    } else if (consent) {
      setConsents(consent.categories || CookieCategoryDefaults)
    }
  }, [initialLoad])

  const handleSave = () => {
    saveConsent({ categories: consents })
    setVisible(false)
  }

  const handleUpdate = () => {
    updateConsent({ categories: consents })
    setShowManager(false)
  }

  const handleRevoke = () => {
    revokeConsent()
    setConsents(CookieCategoryDefaults)
    setShowManager(false)
    setVisible(true)
  }

  const toggleCategory = (category) => {
    if (category === CookieCategories.ESSENTIAL) return // Cannot disable essential
    setConsents(prev => ({ ...prev, [category]: !prev[category] }))
  }

  if (!visible && !showManager) return null

  if (showManager) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
            <button
              onClick={() => setShowManager(false)}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
            <p className="text-sm text-gray-600">
              Manage your cookie preferences. You can change these settings at any time.
            </p>

            {Object.entries(CookieCategoryInfo).map(([key, info]) => (
              <div key={key} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{info.name}</h3>
                      {key === CookieCategories.ESSENTIAL && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                    <p className="text-xs text-gray-500">
                      <strong>Examples:</strong> {info.examples.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCategory(key)}
                    disabled={key === CookieCategories.ESSENTIAL}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      consents[key] ? 'bg-red-600' : 'bg-gray-300'
                    } ${key === CookieCategories.ESSENTIAL ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                        consents[key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t p-6">
            <button
              onClick={handleRevoke}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Revoke All Consent
            </button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowManager(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-red-600 text-white hover:bg-red-700">
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-2xl md:rounded-xl md:border">
      <div className="mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Info className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Cookie Consent</h3>
            <p className="text-sm text-gray-600 mb-2">
              We use cookies to enhance your experience and analyze site usage. By clicking "Accept All", 
              you consent to our use of cookies in accordance with our{' '}
              <Link to="/privacy-policy" className="text-red-600 hover:text-red-700 underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link to="/cookie-policy" className="text-red-600 hover:text-red-700 underline">
                Cookie Policy
              </Link>.
            </p>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showDetails ? 'Hide Details' : 'View Details'}
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-4">
            {Object.entries(CookieCategoryInfo).map(([key, info]) => (
              <div key={key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`cookie-${key}`}
                  checked={consents[key]}
                  onChange={() => toggleCategory(key)}
                  disabled={key === CookieCategories.ESSENTIAL}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <div className="flex-1">
                  <label htmlFor={`cookie-${key}`} className="font-medium text-gray-900 text-sm">
                    {info.name}
                    {key === CookieCategories.ESSENTIAL && (
                      <span className="ml-2 text-xs text-red-600">(Required)</span>
                    )}
                  </label>
                  <p className="text-xs text-gray-600">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSave} size="sm" className="bg-red-600 text-white hover:bg-red-700">
          Accept Selected
        </Button>
        <Button
          onClick={() => {
            setConsents({ ...CookieCategoryDefaults, [CookieCategories.ANALYTICS]: true, [CookieCategories.FUNCTIONAL]: true })
            handleSave()
          }}
          size="sm"
          variant="outline"
        >
          Accept All
        </Button>
        <Button
          onClick={() => {
            setConsents(CookieCategoryDefaults)
            handleSave()
          }}
          size="sm"
          variant="ghost"
        >
          Accept Only Essential
        </Button>
      </div>
    </div>
  )
}

// Export a button to open cookie manager
export function CookieManagerButton() {
  return (
    <button
      onClick={() => {
        const consent = getConsent()
        if (consent) {
          // Trigger the manager by setting state
          window.dispatchEvent(new CustomEvent('openCookieManager'))
        }
      }}
      className="text-sm text-gray-500 hover:text-gray-700 underline"
    >
      Cookie Settings
    </button>
  )
}
