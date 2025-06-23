import React, { useState } from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

function TestApi() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/ping`)
      if (response.ok) {
        const data = await response.json()
        setStatus(data.status === 'ok' ? 'connected' : 'error')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {status === 'connected' ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : status === 'error' ? (
            <WifiOff className="w-5 h-5 text-red-500" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          )}
          <span className="text-sm font-medium">
            Backend Status: {
              status === 'connected' ? 'Connected' :
              status === 'error' ? 'Disconnected' :
              'Unknown'
            }
          </span>
        </div>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="flex items-center space-x-1 px-3 py-1 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded-md disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Test</span>
        </button>
      </div>
      
      {status && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {status === 'connected' 
            ? 'Backend is responding normally'
            : 'Backend is not responding. Make sure docker-compose is running.'
          }
        </p>
      )}
    </div>
  )
}

export default TestApi 