import { createContext, useContext, useState, useEffect } from 'react'

const QuizContext = createContext(null)

const QUIZZES_KEY = 'quizbuilder_quizzes'
const ATTEMPTS_KEY = 'quizbuilder_attempts'

// Seed default quizzes if none exist
function seedQuizzes() {
  const existing = localStorage.getItem(QUIZZES_KEY)
  if (existing) return
  const defaults = [
    {
      id: 'quiz-1',
      title: 'General Knowledge Challenge',
      description: 'Test your knowledge on a variety of topics.',
      category: 'General',
      timeLimit: 10,
      randomize: true,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: 'q1', type: 'multiple-choice',
          text: 'What is the capital of France?',
          options: ['London', 'Paris', 'Berlin', 'Madrid'],
          correct: 1,
        },
        {
          id: 'q2', type: 'true-false',
          text: 'The Great Wall of China is visible from space.',
          options: ['True', 'False'],
          correct: 1,
        },
        {
          id: 'q3', type: 'multiple-choice',
          text: 'Which planet is the largest in our solar system?',
          options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'],
          correct: 2,
        },
        {
          id: 'q4', type: 'multiple-choice',
          text: 'What is 2 + 2 × 2?',
          options: ['6', '8', '4', '10'],
          correct: 0,
        },
        {
          id: 'q5', type: 'true-false',
          text: 'HTML stands for HyperText Markup Language.',
          options: ['True', 'False'],
          correct: 0,
        },
      ]
    },
    {
      id: 'quiz-2',
      title: 'Science & Technology',
      description: 'Explore the world of science and modern technology.',
      category: 'Science',
      timeLimit: 8,
      randomize: false,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: 'q1', type: 'multiple-choice',
          text: 'What does "www" stand for in a website URL?',
          options: ['World Wide Web', 'Wide Web World', 'World Web Wide', 'Web World Wide'],
          correct: 0,
        },
        {
          id: 'q2', type: 'true-false',
          text: 'React is a JavaScript framework.',
          options: ['True', 'False'],
          correct: 1,
        },
        {
          id: 'q3', type: 'multiple-choice',
          text: 'Who invented the telephone?',
          options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Albert Einstein'],
          correct: 1,
        },
        {
          id: 'q4', type: 'multiple-choice',
          text: 'What is the speed of light (approx.)?',
          options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10⁵ m/s', '3×10⁷ m/s'],
          correct: 0,
        },
      ]
    }
  ]
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(defaults))
}

export function QuizProvider({ children }) {
  const [quizzes, setQuizzes] = useState([])
  const [attempts, setAttempts] = useState([])

  useEffect(() => {
    seedQuizzes()
    loadData()
  }, [])

  const loadData = () => {
    const q = JSON.parse(localStorage.getItem(QUIZZES_KEY) || '[]')
    const a = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '[]')
    setQuizzes(q)
    setAttempts(a)
  }

  const saveQuizzes = (updated) => {
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(updated))
    setQuizzes(updated)
  }

  const saveAttempts = (updated) => {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updated))
    setAttempts(updated)
  }

  const addQuiz = (quiz) => {
    const newQuiz = { ...quiz, id: 'quiz-' + Date.now(), createdAt: new Date().toISOString() }
    saveQuizzes([...quizzes, newQuiz])
    return newQuiz
  }

  const updateQuiz = (id, updated) => {
    const updatedList = quizzes.map(q => q.id === id ? { ...q, ...updated, updatedAt: new Date().toISOString() } : q)
    saveQuizzes(updatedList)
  }

  const deleteQuiz = (id) => {
    saveQuizzes(quizzes.filter(q => q.id !== id))
  }

  const getQuiz = (id) => quizzes.find(q => q.id === id)

  const recordAttempt = (attempt) => {
    const newAttempt = { ...attempt, id: 'attempt-' + Date.now(), completedAt: new Date().toISOString() }
    saveAttempts([...attempts, newAttempt])
    return newAttempt
  }

  const getUserAttempts = (userId) => attempts.filter(a => a.userId === userId)
  const getQuizAttempts = (quizId) => attempts.filter(a => a.quizId === quizId)

  return (
    <QuizContext.Provider value={{
      quizzes, attempts,
      addQuiz, updateQuiz, deleteQuiz, getQuiz,
      recordAttempt, getUserAttempts, getQuizAttempts,
      refreshData: loadData,
    }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  return useContext(QuizContext)
}

