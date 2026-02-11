import { prisma } from '@/lib/prisma'
import { CoursesClient } from '@/components/courses-client'
import { Suspense } from 'react'

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      category: true,
    },
    orderBy: {
      students: 'desc',
    },
  })

  const categories = await prisma.category.findMany()

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="text-gray-600 dark:text-gray-400">Loading courses...</div></div>}>
      <CoursesClient courses={courses} categories={categories} />
    </Suspense>
  )
}
