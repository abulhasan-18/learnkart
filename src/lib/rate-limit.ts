import { NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Clean up interval - only in Node.js environment, not during build
let cleanupInterval: NodeJS.Timeout | null = null

// Only start cleanup in runtime, not during build
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  // Clean up old entries every 5 minutes in development
  cleanupInterval = setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  }, 5 * 60 * 1000)
}

// In production, use periodic cleanup on demand
function cleanupStore() {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}

export interface RateLimitOptions {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export function rateLimit(options: RateLimitOptions) {
  return async function checkRateLimit(
    request: Request
  ): Promise<NextResponse | null> {
    // Clean up expired entries in production on each request
    if (process.env.NODE_ENV === 'production') {
      cleanupStore()
    }
    
    // Get client identifier (IP address)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    
    const key = `${ip}:${request.url}`
    const now = Date.now()
    
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + options.interval,
      }
      return null
    }
    
    if (now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + options.interval,
      }
      return null
    }
    
    if (store[key].count >= options.maxRequests) {
      const resetInSeconds = Math.ceil((store[key].resetTime - now) / 1000)
      
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: resetInSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': resetInSeconds.toString(),
            'X-RateLimit-Limit': options.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': store[key].resetTime.toString(),
          },
        }
      )
    }
    
    store[key].count++
    return null
  }
}
