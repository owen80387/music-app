import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, AlertCircle } from 'lucide-react'

function SimpleAudioPlayer({ audioUrl }) {
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef(null)

  // Don't render if no valid audio URL
  if (!audioUrl || typeof audioUrl !== 'string' || !audioUrl.startsWith('http')) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Upload an audio file to preview it here
        </p>
      </div>
    )
  }

  const handlePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (playing) {
        audioRef.current.pause()
        setPlaying(false)
      } else {
        setLoading(true)
        setError(null)
        await audioRef.current.play()
        setPlaying(true)
        setLoading(false)
      }
    } catch (err) {
      console.error('Audio playback error:', err)
      setError('Unable to play audio file')
      setPlaying(false)
      setLoading(false)
    }
  }

  const handleAudioEnd = () => {
    setPlaying(false)
  }

  const handleLoadError = () => {
    setError('Failed to load audio file')
    setLoading(false)
    setPlaying(false)
  }

  const handleCanPlay = () => {
    setLoading(false)
    setError(null)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePlayPause}
            disabled={loading || !!error}
            className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : playing ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-1" />
            )}
          </button>
          
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {playing ? 'Playing...' : 'Ready to play'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Audio Preview
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleAudioEnd}
        onError={handleLoadError}
        onCanPlay={handleCanPlay}
        onLoadStart={() => setLoading(true)}
        style={{ display: 'none' }}
        preload="metadata"
      />
    </div>
  )
}

export default SimpleAudioPlayer 