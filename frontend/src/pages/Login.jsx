import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'
import { Music, LogIn } from 'lucide-react'

function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/beats')
      }
    })
    return unsubscribe
  }, [navigate])

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Music className="h-16 w-16 text-primary-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to MusicApp
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Analyze your beats and discover the perfect sound
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Sign in to get started
              </h3>
              
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
            </div>
            
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <p>By signing in, you agree to our terms of service</p>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="font-semibold">Upload</div>
              <div className="text-xs">Audio files</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="font-semibold">Analyze</div>
              <div className="text-xs">BPM & Key</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="font-semibold">Discover</div>
              <div className="text-xs">Recommendations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 