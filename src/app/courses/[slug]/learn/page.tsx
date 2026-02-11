import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { CoursePlayer } from '@/components/course-player'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const { slug } = await params

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      videos: {
        orderBy: { order: 'asc' },
      },
      tests: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      },
      enrollments: {
        where: {
          userId: session.user.id,
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  const isEnrolled = course.isFree || course.enrollments.length > 0

  if (!isEnrolled) {
    redirect(`/courses/${slug}`)
  }

  if (course.enrollments.length === 0 && course.isFree) {
    // Use upsert to prevent race condition with duplicate enrollments
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        courseId: course.id,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to course details</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
        </div>

        <CoursePlayer course={course} />
      </div>
    </div>
  )
}
