import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Star, Clock, Users, Award, PlayCircle, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions)
  const { slug } = await params
  
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      videos: {
        orderBy: { order: 'asc' },
      },
      tests: {
        orderBy: { order: 'asc' },
        include: {
          questions: true,
        },
      },
      enrollments: session?.user
        ? {
            where: {
              userId: session.user.id,
            },
          }
        : false,
    },
  })

  if (!course) {
    notFound()
  }

  const isEnrolled = session?.user && course.enrollments && course.enrollments.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/30">
      {/* Hero Section with Animated Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white py-20">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 via-purple-600/50 to-pink-600/50 animate-gradient bg-[length:200%_auto]"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="inline-block px-4 py-1.5 glass dark:glass-dark rounded-full text-sm font-bold mb-4 border border-white/20">
                {course.category.name}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-float">{course.title}</h1>
              <p className="text-xl text-purple-100 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-2 glass dark:glass-dark px-4 py-2 rounded-lg">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{course.rating.toFixed(1)}</span>
                  <span className="text-purple-200">({course.students.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center space-x-2 glass dark:glass-dark px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2 glass dark:glass-dark px-4 py-2 rounded-lg">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">{course.level}</span>
                </div>
              </div>

              <p className="text-purple-100">
                Instructor: <span className="font-bold text-white">{course.instructor}</span>
              </p>
            </div>

            <div className="lg:col-span-1">
              <div className="glass dark:glass-dark rounded-2xl shadow-2xl p-6 sticky top-24 border border-white/20">
                <div className="relative rounded-xl overflow-hidden mb-6 group">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-white to-purple-200 bg-clip-text mb-2">
                    {course.isFree ? 'Free' : `$${course.price.toFixed(2)}`}
                  </div>
                  {!course.isFree && (
                    <p className="text-sm text-purple-200">One-time payment</p>
                  )}
                </div>

                {isEnrolled ? (
                  <Link
                    href={`/courses/${course.slug}/learn`}
                    className="block w-full py-4 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-center font-bold rounded-xl transition-all duration-300 hover-lift shadow-lg hover:shadow-emerald-500/50 mb-4"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <>
                    {session ? (
                      <button className="w-full py-4 px-4 bg-gradient-to-r from-white to-purple-100 text-indigo-600 font-bold rounded-xl transition-all duration-300 hover-lift shadow-lg hover:shadow-white/50 mb-4">
                        {course.isFree ? 'Enroll Now' : 'Buy Now'}
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="block w-full py-4 px-4 bg-gradient-to-r from-white to-purple-100 text-indigo-600 text-center font-bold rounded-xl transition-all duration-300 hover-lift shadow-lg hover:shadow-white/50 mb-4"
                      >
                        Login to Enroll
                      </Link>
                    )}
                  </>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-purple-200">Videos</span>
                    <span className="font-bold text-white">{course.videos.length} lectures</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-purple-200">Tests</span>
                    <span className="font-bold text-white">{course.tests.length} quizzes</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-purple-200">Duration</span>
                    <span className="font-bold text-white">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-purple-200">Level</span>
                    <span className="font-bold text-white">{course.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">What you'll learn</h2>
              <div className="glass dark:glass-dark rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Master the fundamentals and advanced concepts',
                    'Build real-world projects from scratch',
                    'Best practices and industry standards',
                    'Hands-on coding exercises and challenges',
                    'Certificate of completion',
                    'Lifetime access to course materials',
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Course Content */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Course Content</h2>
              <div className="space-y-4">
                {course.videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="glass dark:glass-dark rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover-lift group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <PlayCircle className="h-6 w-6 text-white" />
                          </div>
                          <div className="absolute inset-0 bg-indigo-500/30 blur-lg rounded-full group-hover:bg-indigo-500/50 transition-colors duration-300"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                            {index + 1}. {video.title}
                          </h3>
                          {video.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {video.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">{video.duration}</span>
                    </div>
                  </div>
                ))}

                {course.tests.map((test, index) => (
                  <div
                    key={test.id}
                    className="glass dark:glass-dark rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover-lift group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div className="absolute inset-0 bg-purple-500/30 blur-lg rounded-full group-hover:bg-purple-500/50 transition-colors duration-300"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                            Test {index + 1}: {test.title}
                          </h3>
                          {test.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {test.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                        {test.questions.length} questions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="glass dark:glass-dark rounded-2xl shadow-xl p-8 sticky top-24 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">This course includes</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <PlayCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{course.videos.length} video lectures</span>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{course.tests.length} practice tests</span>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Certificate of completion</span>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Community support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
