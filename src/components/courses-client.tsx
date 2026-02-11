'use client'

import { useState, useMemo } from 'react'
import { CourseCard } from '@/components/course-card'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  price: number
  isFree: boolean
  level: string
  duration: string
  instructor: string
  rating: number
  students: number
  category: {
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface CoursesClientProps {
  courses: Course[]
  categories: Category[]
}

export function CoursesClient({ courses, categories }: CoursesClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  // Filter courses in real-time as user types
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = !searchTerm || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = !selectedCategory || course.category.slug === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [courses, searchTerm, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL()
  }

  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set('search', searchTerm.trim())
    if (selectedCategory) params.set('category', selectedCategory)
    
    const queryString = params.toString()
    router.push(`/courses${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            All Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore our wide range of courses and start learning today
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="mb-10">
          <div className="glass dark:glass-dark rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-800/50">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 pl-14 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 group-hover:border-indigo-300 dark:group-hover:border-indigo-600"
                  />
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </form>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600 font-medium cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Results count */}
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Found <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'}
              </p>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <div key={course.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-float">
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="glass dark:glass-dark rounded-2xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
