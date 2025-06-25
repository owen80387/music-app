import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import AuthGate from './components/AuthGate.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import History from './pages/History.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          {user && <Navbar user={user} darkMode={darkMode} setDarkMode={setDarkMode} />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/beats" 
              element={
                <AuthGate user={user}>
                  <Dashboard />
                </AuthGate>
              } 
            />
            <Route 
              path="/history" 
              element={
                <AuthGate user={user}>
                  <History />
                </AuthGate>
              } 
            />
            <Route 
              path="/" 
              element={
                <AuthGate user={user}>
                  <Dashboard />
                </AuthGate>
              } 
            />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App 