import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Seed demo accounts on first run
function seedDemoAccounts() {
  const existing = localStorage.getItem('quizbuilder_users')
  if (existing) return
  const demos = [
    { id: 'admin-1', name: 'Admin User', email: 'admin@quiz.com', password: 'admin123', role: 'admin', createdAt: new Date().toISOString() },
    { id: 'user-1', name: 'Demo Student', email: 'user@quiz.com', password: 'user123', role: 'user', createdAt: new Date().toISOString() },
  ]
  localStorage.setItem('quizbuilder_users', JSON.stringify(demos))
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedDemoAccounts()
    const user = localStorage.getItem('quizbuilder_user')
    if (user) setCurrentUser(JSON.parse(user))
    setLoading(false)
  }, [])

  const signup = (name, email, password, role = 'user') => {
    const users = JSON.parse(localStorage.getItem('quizbuilder_users') || '[]')
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered.' }
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    localStorage.setItem('quizbuilder_users', JSON.stringify(users))
    const { password: _, ...safeUser } = newUser
    setCurrentUser(safeUser)
    localStorage.setItem('quizbuilder_user', JSON.stringify(safeUser))
    return { success: true }
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('quizbuilder_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, error: 'Invalid email or password.' }
    const { password: _, ...safeUser } = found
    setCurrentUser(safeUser)
    localStorage.setItem('quizbuilder_user', JSON.stringify(safeUser))
    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('quizbuilder_user')
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
