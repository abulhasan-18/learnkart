'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

interface Category {
  id: string
  name: string
  slug: string
}

interface CourseSearchProps {
  categories: Category[]
}

export function CourseSearch({ categories }: CourseSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
    setSelectedCategory(searchParams.get('category') || '')
  }, [searchParams])

  const updateURL = useCallback((search: string, category: string) => {
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (category) params.set('category', category)
    
    const queryString = params.toString()
    router.push(`/courses${queryString ? `?${queryString}` : ''}`)
  }, [router])

  // Debounced search - automatically search as user types
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      updateURL(searchTerm, selectedCategory)
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedCategory, updateURL])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL(searchTerm, selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </form>
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}
