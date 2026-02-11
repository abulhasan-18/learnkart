import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Users, Video, Award, CheckCircle } from 'lucide-react'

interface LiveClassPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LiveClassPage({ params }: LiveClassPageProps) {
  const { slug } = await params

  // Get category by slug
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    notFound()
  }

  // Get all courses in this category with their live classes
  const courses = await prisma.course.findMany({
    where: { categoryId: category.id },
    include: {
      liveClasses: {
        orderBy: {
          scheduledAt: 'desc',
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  })

  // Separate live classes by status
  const now = new Date()
  const allLiveClasses = courses.flatMap((course) =>
    course.liveClasses.map((liveClass) => ({
      ...liveClass,
      courseName: course.title,
      courseSlug: course.slug,
    }))
  )

  const upcomingClasses = allLiveClasses.filter(
    (lc) => lc.status === 'upcoming' && new Date(lc.scheduledAt) > now
  )
  const liveClasses = allLiveClasses.filter((lc) => lc.status === 'live')
  const completedClasses = allLiveClasses.filter((lc) => lc.status === 'completed')

  // Calculate total students and certified
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const totalCertified = courses.reduce((sum, course) => sum + course.certified, 0)
  const totalEnrolled = courses.reduce((sum, course) => sum + course._count.enrollments, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/announcements"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Announcements
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{category.name}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category.name} Live Classes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {category.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {courses.length}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Courses</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {totalStudents.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">Total Students</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {totalEnrolled.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Enrolled</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {totalCertified.toLocaleString()}
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Live Now */}
        {liveClasses.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Live Now
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {liveClasses.map((liveClass) => (
                <LiveClassCard key={liveClass.id} liveClass={liveClass} isLive />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Classes */}
        {upcomingClasses.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Upcoming Classes
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {upcomingClasses.map((liveClass) => (
                <LiveClassCard key={liveClass.id} liveClass={liveClass} />
              ))}
            </div>
          </section>
        ) : (
          !liveClasses.length && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Upcoming Classes
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
                <Calendar className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  No upcoming classes scheduled yet
                </p>
                <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">
                  Check back soon for new live sessions!
                </p>
              </div>
            </section>
          )
        )}

        {/* Past Classes */}
        {completedClasses.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Past Classes
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {completedClasses.map((liveClass) => (
                <LiveClassCard key={liveClass.id} liveClass={liveClass} isPast />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function LiveClassCard({
  liveClass,
  isLive = false,
  isPast = false,
}: {
  liveClass: any
  isLive?: boolean
  isPast?: boolean
}) {
  const scheduledDate = new Date(liveClass.scheduledAt)
  const formattedDate = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border ${
        isLive
          ? 'border-red-500 shadow-red-500/20'
          : isPast
            ? 'border-gray-200 dark:border-gray-700'
            : 'border-blue-200 dark:border-blue-800'
      } overflow-hidden hover:shadow-lg transition-shadow`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            {isLive && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE NOW
              </span>
            )}
            {isPast && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 dark:bg-gray-600 text-white text-xs font-semibold rounded-full mb-3">
                COMPLETED
              </span>
            )}

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {liveClass.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{liveClass.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <Link
                  href={`/courses/${liveClass.courseSlug}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {liveClass.courseName}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Instructor: {liveClass.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {formattedTime} · {liveClass.duration}
                </span>
              </div>
              {isPast && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{liveClass.attendees} attendees</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isLive && liveClass.meetingUrl && (
              <a
                href={liveClass.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-center transition-colors"
              >
                Join Live Session
              </a>
            )}
            {!isLive && !isPast && liveClass.meetingUrl && (
              <a
                href={liveClass.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-center transition-colors"
              >
                Add to Calendar
              </a>
            )}
            <Link
              href={`/courses/${liveClass.courseSlug}`}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg text-center transition-colors"
            >
              View Course
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
