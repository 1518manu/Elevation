/**
 * DPDP-Compliant Cookie Consent Manager
 * Implements Digital Personal Data Protection Act requirements
 */

const CONSENT_VERSION = '1.0'
const CONSENT_EXPIRY_DAYS = 365
const STORAGE_KEY = 'alfa_cookie_consent'
const CONSENT_LOG_KEY = 'alfa_consent_log'

export const CookieCategories = {
  ESSENTIAL: 'essential',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  FUNCTIONAL: 'functional',
}

export const CookieCategoryDefaults = {
  [CookieCategories.ESSENTIAL]: true, // Always required
  [CookieCategories.ANALYTICS]: false,
  [CookieCategories.MARKETING]: false,
  [CookieCategories.FUNCTIONAL]: false,
}

export const CookieCategoryInfo = {
  [CookieCategories.ESSENTIAL]: {
    name: 'Essential Cookies',
    description: 'Required for the website to function properly. These cookies enable core functionality such as security, network management, and accessibility.',
    examples: ['Authentication', 'Session management', 'Security tokens'],
  },
  [CookieCategories.ANALYTICS]: {
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    examples: ['Google Analytics', 'Page views', 'User behavior tracking'],
  },
  [CookieCategories.MARKETING]: {
    name: 'Marketing Cookies',
    description: 'Used to track visitors across websites to display relevant advertisements and measure the effectiveness of marketing campaigns.',
    examples: ['Ad personalization', 'Conversion tracking', 'Social media integration'],
  },
  [CookieCategories.FUNCTIONAL]: {
    name: 'Functional Cookies',
    description: 'Enable enhanced functionality and personalization, such as videos and live chats.',
    examples: ['Language preferences', 'Remembering choices', 'Customized content'],
  },
}

/**
 * Set a secure cookie with proper attributes
 */
function setSecureCookie(name, value, days) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  const isSecure = window.location.protocol === 'https:'
  const sameSite = 'Strict'
  
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=${sameSite}${isSecure ? '; Secure' : ''}`
}

/**
 * Get a cookie value
 */
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift())
  return null
}

/**
 * Delete a cookie
 */
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
}

/**
 * Log consent action for audit trail
 */
function logConsentAction(action, consentData) {
  try {
    const log = JSON.parse(localStorage.getItem(CONSENT_LOG_KEY) || '[]')
    log.push({
      timestamp: new Date().toISOString(),
      action,
      version: CONSENT_VERSION,
      consentData: { ...consentData },
      userAgent: navigator.userAgent,
    })
    
    // Keep only last 100 log entries
    if (log.length > 100) log.shift()
    
    localStorage.setItem(CONSENT_LOG_KEY, JSON.stringify(log))
  } catch (error) {
    console.error('Failed to log consent action:', error)
  }
}

/**
 * Check if consent has expired
 */
function isConsentExpired(consentData) {
  if (!consentData.timestamp) return true
  const consentDate = new Date(consentData.timestamp)
  const expiryDate = new Date(consentDate.getTime() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
  return new Date() > expiryDate
}

/**
 * Get current consent data
 */
export function getConsent() {
  try {
    const cookieValue = getCookie(STORAGE_KEY)
    if (!cookieValue) return null
    
    const consentData = JSON.parse(cookieValue)
    
    // Check version compatibility
    if (consentData.version !== CONSENT_VERSION) {
      return null // Require new consent for version change
    }
    
    // Check expiry
    if (isConsentExpired(consentData)) {
      return null // Require new consent after expiry
    }
    
    return consentData
  } catch (error) {
    console.error('Failed to parse consent data:', error)
    return null
  }
}

/**
 * Save consent data
 */
export function saveConsent(consentData) {
  try {
    const data = {
      ...consentData,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
    }
    
    setSecureCookie(STORAGE_KEY, JSON.stringify(data), CONSENT_EXPIRY_DAYS)
    logConsentAction('consent_given', data)
    
    return true
  } catch (error) {
    console.error('Failed to save consent:', error)
    return false
  }
}

/**
 * Update consent (for withdrawal or changes)
 */
export function updateConsent(newConsent) {
  try {
    const currentConsent = getConsent()
    const data = {
      ...newConsent,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      previousConsent: currentConsent ? { ...currentConsent } : null,
    }
    
    setSecureCookie(STORAGE_KEY, JSON.stringify(data), CONSENT_EXPIRY_DAYS)
    logConsentAction('consent_updated', data)
    
    return true
  } catch (error) {
    console.error('Failed to update consent:', error)
    return false
  }
}

/**
 * Revoke all consent
 */
export function revokeConsent() {
  try {
    deleteCookie(STORAGE_KEY)
    logConsentAction('consent_revoked', {})
    return true
  } catch (error) {
    console.error('Failed to revoke consent:', error)
    return false
  }
}

/**
 * Check if specific category is consented
 */
export function hasConsent(category) {
  const consent = getConsent()
  if (!consent) return false
  
  // Essential cookies are always allowed
  if (category === CookieCategories.ESSENTIAL) return true
  
  return consent.categories?.[category] === true
}

/**
 * Get consent log for audit
 */
export function getConsentLog() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_LOG_KEY) || '[]')
  } catch (error) {
    return []
  }
}

/**
 * Clear consent log (for privacy)
 */
export function clearConsentLog() {
  try {
    localStorage.removeItem(CONSENT_LOG_KEY)
    return true
  } catch (error) {
    return false
  }
}
