import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, Users } from 'lucide-react'

interface CourseCardProps {
  course: {
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
    }
  }
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="group cursor-pointer glass dark:glass-dark rounded-2xl hover-lift transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-pink-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Free badge with gradient */}
          {course.isFree && (
            <div className="absolute top-3 right-3 z-20">
              <span className="relative inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-bold shadow-lg animate-pulse-glow">
                Free
              </span>
            </div>
          )}
          
          {/* Level badge with gradient */}
          <span className="absolute top-3 left-3 z-20 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg">
            {course.level}
          </span>
          
          {/* Play overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="w-16 h-16 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text uppercase tracking-wide">
              {course.category.name}
            </span>
            <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{course.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 dark:group-hover:from-indigo-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-medium">{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="font-medium">{course.students.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              by {course.instructor}
            </span>
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text">
              {course.isFree ? 'Free' : `$${course.price.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
