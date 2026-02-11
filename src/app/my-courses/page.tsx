import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CourseCard } from '@/components/course-card'
import { BookOpen, Award, Clock } from 'lucide-react'

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      course: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      enrolledAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Learning</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue where you left off or explore new courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold">{enrollments.length}</p>
              </div>
              <BookOpen className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">In Progress</p>
                <p className="text-3xl font-bold">
                  {enrollments.filter((e) => e.progress < 100).length}
                </p>
              </div>
              <Clock className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                <p className="text-3xl font-bold">
                  {enrollments.filter((e) => e.progress === 100).length}
                </p>
              </div>
              <Award className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No courses yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start learning by enrolling in a course
            </p>
            <a
              href="/courses"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Courses
            </a>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map(({ course, progress }) => (
                <div key={course.id} className="relative">
                  <CourseCard course={course} />
                  {progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-b-xl p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{progress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
