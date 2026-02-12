import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Users, Video, Award, CheckCircle, TrendingUp, BookOpen, Star, Play, BarChart3, Target } from 'lucide-react'
import { Metadata } from 'next'
import { cache } from 'react'

interface LiveClassPageProps {
  params: Promise<{
    slug: string
  }>
}

interface LiveClassWithStats {
  id: string
  title: string
  description: string
  scheduledAt: Date
  duration: string
  meetingUrl: string | null
  status: string
  instructor: string
  attendees: number
  courseName: string
  courseSlug: string
  courseStudents: number
  courseCertified: number
  courseRating: number
  courseLevel: string
  coursePrice: number
  courseIsFree: boolean
  enrollmentsAfterClass: number
  conversionRate: number
  engagementScore: number
}

// Cache the category fetch for metadata and page
const getCategory = cache(async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      courses: {
        include: {
          liveClasses: {
            orderBy: {
              scheduledAt: 'desc',
            },
          },
          enrollments: true,
          _count: {
            select: {
              enrollments: true,
              videos: true,
              tests: true,
            },
          },
        },
      },
    },
  })
})

// Generate metadata for SEO
export async function generateMetadata({ params }: LiveClassPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    }
  }

  const totalClasses = category.courses.reduce((sum, course) => sum + course.liveClasses.length, 0)
  const totalStudents = category.courses.reduce((sum, course) => sum + course.students, 0)
  
  return {
    title: `${category.name} Live Classes - Interactive Learning Sessions`,
    description: category.description || `Join live interactive classes for ${category.name}. ${totalClasses} sessions conducted with ${totalStudents.toLocaleString()} students enrolled.`,
    keywords: `${category.name}, live classes, online learning, interactive sessions, webinar, virtual classroom`,
    openGraph: {
      title: `${category.name} Live Classes`,
      description: category.description || `Interactive live learning sessions for ${category.name}`,
      type: 'website',
    },
  }
}

export default async function LiveClassPage({ params }: LiveClassPageProps) {
  const { slug } = await params

  // Validate slug format
  if (!slug || typeof slug !== 'string' || slug.length > 100) {
    notFound()
  }

  // Get category with all related data
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const courses = category.courses

  // Validate courses data
  if (!Array.isArray(courses)) {
    console.error('Invalid courses data structure')
    notFound()
  }

  // Separate live classes by status and add enhanced metrics
  const now = new Date()
  const allLiveClasses: LiveClassWithStats[] = courses.flatMap((course) =>
    course.liveClasses.map((liveClass) => {
      // Calculate enrollments that happened after this live class
      const enrollmentsAfterClass = course.enrollments.filter(
        (enrollment) => new Date(enrollment.enrolledAt) >= new Date(liveClass.scheduledAt)
      ).length

      // Calculate conversion rate (enrollments after class / attendees)
      const conversionRate = liveClass.attendees > 0 
        ? (enrollmentsAfterClass / liveClass.attendees) * 100 
        : 0

      // Calculate engagement score based on multiple factors
      const engagementScore = liveClass.status === 'completed'
        ? Math.min(100, Math.round(
            (liveClass.attendees / (course.students || 1)) * 50 + // Attendance rate (50%)
            (conversionRate > 0 ? 30 : 0) + // Conversion bonus (30%)
            (course.rating / 5) * 20 // Course rating impact (20%)
          ))
        : 0

      return {
        ...liveClass,
        courseName: course.title,
        courseSlug: course.slug,
        courseStudents: course.students,
        courseCertified: course.certified,
        courseRating: course.rating,
        courseLevel: course.level,
        coursePrice: course.price,
        courseIsFree: course.isFree,
        enrollmentsAfterClass,
        conversionRate: Math.round(conversionRate * 10) / 10,
        engagementScore,
      }
    })
  )

  const upcomingClasses = allLiveClasses.filter(
    (lc) => lc.status === 'upcoming' && new Date(lc.scheduledAt) > now
  )
  const liveClasses = allLiveClasses.filter((lc) => lc.status === 'live')
  const completedClasses = allLiveClasses.filter((lc) => lc.status === 'completed')

  // Calculate comprehensive statistics
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const totalCertified = courses.reduce((sum, course) => sum + course.certified, 0)
  const totalEnrolled = courses.reduce((sum, course) => sum + course._count.enrollments, 0)
  const totalVideos = courses.reduce((sum, course) => sum + (course._count.videos || 0), 0)
  const totalTests = courses.reduce((sum, course) => sum + (course._count.tests || 0), 0)
  const averageRating = courses.length > 0 
    ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length 
    : 0
  const totalAttendees = completedClasses.reduce((sum, lc) => sum + lc.attendees, 0)
  const averageAttendance = completedClasses.length > 0 
    ? Math.round(totalAttendees / completedClasses.length) 
    : 0
  const totalEnrollmentsFromClasses = completedClasses.reduce((sum, lc) => sum + lc.enrollmentsAfterClass, 0)
  const averageConversionRate = completedClasses.length > 0
    ? completedClasses.reduce((sum, lc) => sum + lc.conversionRate, 0) / completedClasses.length
    : 0

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {courses.length}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Active Courses</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
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

            <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {totalEnrolled.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Active Enrollments</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {totalCertified.toLocaleString()}
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Certified Students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Avg Rating</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {averageRating.toFixed(1)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Play className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Videos</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {totalVideos.toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-green-500" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Tests</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {totalTests.toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Live Classes</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {allLiveClasses.length}
              </p>
            </div>
          </div>

          {/* Performance Metrics for Completed Classes */}
          {completedClasses.length > 0 && (
            <div className="mt-6 p-4 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Live Class Performance Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Sessions</p>
                  <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                    {completedClasses.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Attendees</p>
                  <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                    {totalAttendees.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Attendance</p>
                  <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                    {averageAttendance}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</p>
                  <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                    {averageConversionRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    New enrollments from live classes:
                  </span>
                  <span className="font-bold text-indigo-900 dark:text-indigo-100">
                    +{totalEnrollmentsFromClasses} students
                  </span>
                </div>
              </div>
            </div>
          )}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upcoming Classes
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{upcomingClasses.length} scheduled</span>
              </div>
            </div>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Past Classes
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>{completedClasses.length} events conducted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {completedClasses.reduce((sum, lc) => sum + lc.attendees, 0)} total attendees
                  </span>
                </div>
              </div>
            </div>
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
  liveClass: LiveClassWithStats
  isLive?: boolean
  isPast?: boolean
}) {
  const scheduledDate = new Date(liveClass.scheduledAt)
  
  // Enhanced date formatting with more context
  const formattedDate = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
  
  // Calculate time until/since class
  const now = new Date()
  const timeDiff = scheduledDate.getTime() - now.getTime()
  const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  const hoursUntil = Math.ceil(timeDiff / (1000 * 60 * 60))
  
  let timeLabel = ''
  if (!isPast && !isLive) {
    if (daysUntil > 1) {
      timeLabel = `Starts in ${daysUntil} days`
    } else if (hoursUntil > 1) {
      timeLabel = `Starts in ${hoursUntil} hours`
    } else if (hoursUntil === 1) {
      timeLabel = 'Starting soon!'
    } else {
      timeLabel = 'Starting now!'
    }
  }

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
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {isLive && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  LIVE NOW
                </span>
              )}
              {isPast && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 dark:bg-gray-600 text-white text-xs font-semibold rounded-full">
                  COMPLETED
                </span>
              )}
              {!isPast && !isLive && timeLabel && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                  <Clock className="w-3 h-3" />
                  {timeLabel}
                </span>
              )}
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                liveClass.courseLevel === 'Beginner' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : liveClass.courseLevel === 'Intermediate'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {liveClass.courseLevel}
              </span>
              {liveClass.courseIsFree ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-semibold rounded-full">
                  FREE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold rounded-full">
                  Premium - ${liveClass.coursePrice}
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {liveClass.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{liveClass.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <Link
                  href={`/courses/${liveClass.courseSlug}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  {liveClass.courseName}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Instructor: <span className="font-medium">{liveClass.instructor}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Course Rating: <span className="font-medium">{liveClass.courseRating.toFixed(1)}</span></span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                  <span className="font-medium">{liveClass.attendees} attendees</span>
                </div>
              )}
            </div>

            {/* Enhanced Statistics for Past Events */}
            {isPast && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Impact & Performance Metrics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        New Enrollments
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      +{liveClass.enrollmentsAfterClass}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      After this session
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Course Students
                      </span>
                    </div>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {liveClass.courseStudents.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Total enrolled
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-100 dark:border-yellow-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                        Certified
                      </span>
                    </div>
                    <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                      {liveClass.courseCertified.toLocaleString()}
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Completion rate
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        Conversion
                      </span>
                    </div>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      {liveClass.conversionRate}%
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                      Attendees to enrollments
                    </p>
                  </div>
                </div>

                {/* Engagement Score */}
                {liveClass.engagementScore > 0 && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-medium text-indigo-900 dark:text-indigo-100">
                          Engagement Score
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              liveClass.engagementScore >= 70 
                                ? 'bg-green-500' 
                                : liveClass.engagementScore >= 40 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${liveClass.engagementScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                          {liveClass.engagementScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 min-w-45">
            {isLive && liveClass.meetingUrl && (
              <a
                href={liveClass.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Join Live Session
              </a>
            )}
            {!isLive && !isPast && liveClass.meetingUrl && (
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(liveClass.title)}&dates=${scheduledDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(scheduledDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(liveClass.description)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Add to Calendar
              </a>
            )}
            <Link
              href={`/courses/${liveClass.courseSlug}`}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg text-center transition-colors"
            >
              View Course
            </Link>
            {isPast && (
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
                Session completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
