import Link from 'next/link'
import { BookOpen, Award, Users, TrendingUp } from 'lucide-react'
import { CourseCard } from '@/components/course-card'
import { HeroSearch } from '@/components/hero-search'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const courses = await prisma.course.findMany({
    include: {
      category: true,
    },
    take: 8,
    orderBy: {
      students: 'desc',
    },
  })

  const categories = await prisma.category.findMany()

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white py-24">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 via-purple-600/50 to-pink-600/50 animate-gradient bg-[length:200%_auto]"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
              Learn Without Limits
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-purple-100 max-w-3xl mx-auto">
              Start, switch, or advance your career with thousands of courses from world-class instructors
            </p>
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 glass dark:glass-dark rounded-2xl hover-lift group">
              <div className="relative inline-block mb-4">
                <BookOpen className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-indigo-600/20 blur-xl group-hover:bg-indigo-600/40 transition-colors duration-300 rounded-full"></div>
              </div>
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">1000+</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Online Courses</p>
            </div>
            <div className="text-center p-8 glass dark:glass-dark rounded-2xl hover-lift group">
              <div className="relative inline-block mb-4">
                <Users className="h-16 w-16 text-purple-600 dark:text-purple-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-purple-600/20 blur-xl group-hover:bg-purple-600/40 transition-colors duration-300 rounded-full"></div>
              </div>
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">50K+</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Active Students</p>
            </div>
            <div className="text-center p-8 glass dark:glass-dark rounded-2xl hover-lift group">
              <div className="relative inline-block mb-4">
                <Award className="h-16 w-16 text-pink-600 dark:text-pink-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-pink-600/20 blur-xl group-hover:bg-pink-600/40 transition-colors duration-300 rounded-full"></div>
              </div>
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-red-600 dark:from-pink-400 dark:to-red-400 bg-clip-text text-transparent">100+</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Expert Instructors</p>
            </div>
            <div className="text-center p-8 glass dark:glass-dark rounded-2xl hover-lift group">
              <div className="relative inline-block mb-4">
                <TrendingUp className="h-16 w-16 text-emerald-600 dark:text-emerald-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-emerald-600/20 blur-xl group-hover:bg-emerald-600/40 transition-colors duration-300 rounded-full"></div>
              </div>
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">95%</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Browse Top Categories
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-14 text-lg">
            Explore our wide range of course categories
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/courses?category=${category.slug}`}
                className="relative p-6 text-center glass dark:glass-dark rounded-2xl hover-lift group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <p className="relative font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-14 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Popular Courses
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Start learning from the best courses
              </p>
            </div>
            <Link
              href="/courses"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover-lift shadow-lg hover:shadow-indigo-500/50 font-semibold"
            >
              View All Courses
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 via-purple-600/50 to-pink-600/50 animate-gradient bg-[length:200%_auto]"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-float">
            Ready to Start Learning?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-purple-100 max-w-2xl mx-auto">
            Join thousands of students learning new skills every day
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 glass dark:glass-dark text-white rounded-xl font-semibold hover-lift text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 border border-white/20"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}

