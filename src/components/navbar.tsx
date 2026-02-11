'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from './theme-toggle'
import { Search, ShoppingCart, User, LogOut, BookOpen, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [announcementsOpen, setAnnouncementsOpen] = useState(false)

  const categories = [
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Machine Learning', slug: 'machine-learning' },
    { name: 'Data Science', slug: 'data-science' },
    { name: 'Python Programming', slug: 'python' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-indigo-600/20 blur-xl group-hover:bg-indigo-600/40 transition-colors duration-300 rounded-full"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                LearnKart
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/courses"
                className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium group"
              >
                Courses
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Announcements Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAnnouncementsOpen(!announcementsOpen)}
                  onBlur={() => setTimeout(() => setAnnouncementsOpen(false), 200)}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium group"
                >
                  <span>Announcements</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${announcementsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {announcementsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Live Course Categories
                    </div>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/announcements/${category.slug}`}
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        onClick={() => setAnnouncementsOpen(false)}
                      >
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          View live classes & details
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {session && (
                <Link
                  href="/my-courses"
                  className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium group"
                >
                  My Learning
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{session.user?.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover-lift shadow-lg hover:shadow-red-500/50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover-lift shadow-lg hover:shadow-indigo-500/50 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="block py-2 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
            
            {/* Mobile Announcements */}
            <div className="py-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Announcements
              </div>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/announcements/${category.slug}`}
                  className="block py-2 pl-4 text-gray-700 dark:text-gray-300 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {session && (
              <Link
                href="/my-courses"
                className="block py-2 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Learning
              </Link>
            )}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 text-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
