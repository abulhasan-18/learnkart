import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { resetPasswordSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { ZodError } from 'zod'

// Rate limit: 5 requests per 15 minutes
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
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
    const validatedData = resetPasswordSchema.parse(body)

    // Find password reset token
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token: validatedData.token },
      include: { user: true },
    })

    // Validate token
    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    if (resetToken.used) {
      return NextResponse.json(
        { error: 'This reset link has already been used' },
        { status: 400 }
      )
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { error: 'This reset link has expired' },
        { status: 400 }
      )
    }

    // Hash new password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Update user password and mark token as used (atomic transaction)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ])

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
