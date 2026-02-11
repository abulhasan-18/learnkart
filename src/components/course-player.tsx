'use client'

import { useState } from 'react'
import { PlayCircle, FileText, CheckCircle, ChevronRight } from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string | null
  url: string
  duration: string
  order: number
}

interface Test {
  id: string
  title: string
  description: string | null
  order: number
  questions: Question[]
}

interface Question {
  id: string
  question: string
  options: string
  correctAnswer: number
  explanation: string | null
}

interface Course {
  id: string
  title: string
  videos: Video[]
  tests: Test[]
}

export function CoursePlayer({ course }: { course: Course }) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(course.videos[0] || null)
  const [currentTest, setCurrentTest] = useState<Test | null>(null)
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set())
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set())

  const markVideoComplete = (videoId: string) => {
    setCompletedVideos(new Set([...completedVideos, videoId]))
  }

  const markTestComplete = (testId: string) => {
    setCompletedTests(new Set([...completedTests, testId]))
  }

  const playVideo = (video: Video) => {
    setCurrentVideo(video)
    setCurrentTest(null)
  }

  const openTest = (test: Test) => {
    setCurrentVideo(null)
    setCurrentTest(test)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen">
      <div className="lg:col-span-3">
        {currentVideo && (
          <div>
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <iframe
                src={currentVideo.url}
                title={currentVideo.title}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
              {currentVideo.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">{currentVideo.description}</p>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Duration: {currentVideo.duration}
                </span>
                <button
                  onClick={() => markVideoComplete(currentVideo.id)}
                  disabled={completedVideos.has(currentVideo.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    completedVideos.has(currentVideo.id)
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {completedVideos.has(currentVideo.id) ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentTest && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">{currentTest.title}</h2>
            {currentTest.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">{currentTest.description}</p>
            )}
            <TestComponent test={currentTest} onComplete={() => markTestComplete(currentTest.id)} />
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">Course Content</h3>
          <div className="space-y-2">
            {course.videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => playVideo(video)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentVideo?.id === video.id
                    ? 'bg-indigo-100 dark:bg-indigo-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    {completedVideos.has(video.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <PlayCircle className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {index + 1}. {video.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{video.duration}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                </div>
              </button>
            ))}

            {course.tests.map((test, index) => (
              <button
                key={test.id}
                onClick={() => openTest(test)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentTest?.id === test.id
                    ? 'bg-purple-100 dark:bg-purple-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    {completedTests.has(test.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <FileText className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        Test {index + 1}: {test.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {test.questions.length} questions
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TestComponent({ test, onComplete }: { test: Test; onComplete: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const question = test.questions[currentQuestion]
  let options: string[] = []
  
  try {
    options = question ? JSON.parse(question.options) : []
  } catch (error) {
    console.error('Error parsing question options:', error)
    options = []
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (showResults) {
    const score = test.questions.filter(
      (q, index) => answers[index] === q.correctAnswer
    ).length

    return (
      <div className="text-center py-8">
        <h3 className="text-3xl font-bold mb-4">Test Complete!</h3>
        <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
          {score} / {test.questions.length}
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          You scored {Math.round((score / test.questions.length) * 100)}%
        </p>
        <div className="space-y-6">
          {test.questions.map((q, index) => {
            let opts: string[] = []
            try {
              opts = JSON.parse(q.options)
            } catch (error) {
              console.error('Error parsing question options:', error)
              opts = []
            }
            
            const userAnswer = answers[index]
            const isCorrect = userAnswer === q.correctAnswer

            return (
              <div
                key={q.id}
                className="text-left bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
              >
                <p className="font-semibold mb-2">
                  {index + 1}. {q.question}
                </p>
                {userAnswer !== undefined && opts[userAnswer] && (
                  <p className={`text-sm mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {opts[userAnswer]} {isCorrect ? '✓' : '✗'}
                  </p>
                )}
                {!isCorrect && opts[q.correctAnswer] && (
                  <p className="text-sm text-green-600 mb-1">
                    Correct answer: {opts[q.correctAnswer]}
                  </p>
                )}
                {q.explanation && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {q.explanation}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {test.questions.length}
          </span>
          <span className="text-sm font-semibold">
            {answers.filter((a) => a !== undefined).length} / {test.questions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6">{question.question}</h3>

      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
              answers[currentQuestion] === index
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={answers[currentQuestion] === undefined}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
        >
          {currentQuestion === test.questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
