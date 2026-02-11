import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import { forgotPasswordSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { ZodError } from 'zod'
import crypto from 'crypto'

// Rate limit: 3 requests per 15 minutes
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3,
})

export async function POST(req: Request) {
  try {
    // Check rate limit
    const rateLimitResult = await limiter(req)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const body = await req.json()

    // Validate input with Zod
    const validatedData = forgotPasswordSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    })

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json(
        { message: 'If the email exists, a password reset link has been sent' },
        { status: 200 }
      )
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    // Invalidate any existing unused tokens for this user
    await prisma.passwordReset.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    })

    // Create new password reset token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Send password reset email
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`
    
    try {
      await sendPasswordResetEmail(user.email, resetUrl)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't fail the request if email fails - token is still created
    }

    // In development, return the token in the response (REMOVE IN PRODUCTION!)
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          message: 'Password reset link generated',
          resetUrl, // Only for development
          token, // Only for development
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: 'If the email exists, a password reset link has been sent' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
