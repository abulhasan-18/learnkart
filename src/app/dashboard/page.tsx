import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { User, Mail, BookOpen, Award, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              category: true,
            },
          },
        },
      },
      testResults: {
        include: {
          test: {
            include: {
              course: true,
            },
          },
        },
        orderBy: {
          completedAt: 'desc',
        },
        take: 5,
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user.name || 'Student'}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Learning Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold mb-1">{user.enrollments.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Courses Enrolled</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Award className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold mb-1">
                    {user.enrollments.filter((e) => e.progress === 100).length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold mb-1">{user.testResults.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tests Taken</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Test Results</h2>
              {user.testResults.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No test results yet. Start taking tests to see your progress!
                </p>
              ) : (
                <div className="space-y-4">
                  {user.testResults.map((result) => {
                    const percentage = Math.round((result.score / result.totalQuestions) * 100)
                    return (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{result.test.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.test.course.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${
                              percentage >= 80
                                ? 'text-green-600'
                                : percentage >= 60
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {percentage}%
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.score}/{result.totalQuestions}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Student</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-3">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Enrollments</span>
                      <span className="font-semibold">{user.enrollments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tests Completed</span>
                      <span className="font-semibold">{user.testResults.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                      <span className="font-semibold">
                        {user.testResults.length > 0
                          ? Math.round(
                              user.testResults.reduce(
                                (acc, r) => acc + (r.score / r.totalQuestions) * 100,
                                0
                              ) / user.testResults.length
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
