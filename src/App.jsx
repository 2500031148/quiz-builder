import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { QuizProvider } from './context/QuizContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import CreateQuiz from './pages/admin/CreateQuiz'
import ManageQuizzes from './pages/admin/ManageQuizzes'
import AdminReports from './pages/admin/AdminReports'
import EditQuiz from './pages/admin/EditQuiz'

// User pages
import UserDashboard from './pages/user/UserDashboard'
import TakeQuiz from './pages/user/TakeQuiz'
import QuizResult from './pages/user/QuizResult'
import UserHistory from './pages/user/UserHistory'

// Shared
import Navbar from './components/Navbar'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QuizProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <Navbar />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="create-quiz" element={<CreateQuiz />} />
              <Route path="manage-quizzes" element={<ManageQuizzes />} />
              <Route path="edit-quiz/:id" element={<EditQuiz />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute role="user">
                  <Navbar />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="take-quiz/:id" element={<TakeQuiz />} />
              <Route path="result/:id" element={<QuizResult />} />
              <Route path="history" element={<UserHistory />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </QuizProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

