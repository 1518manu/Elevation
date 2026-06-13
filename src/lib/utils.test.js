import { describe, it, expect } from 'vitest'
import { slugify, formatDate } from '@/lib/utils'

describe('utils', () => {
  it('slugify converts text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('formatDate formats dates in en-IN locale', () => {
    const result = formatDate('2024-06-15')
    expect(result).toContain('2024')
  })
})
