import React, { useState } from 'react'
import Upload from '../components/Upload.jsx'
import SimpleAudioPlayer from '../components/SimpleAudioPlayer.jsx'
import ResultCard from '../components/ResultCard.jsx'
import TestApi from '../components/TestApi.jsx'
import { useUpload } from '../hooks/useUpload.js'
import { RotateCcw } from 'lucide-react'

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null) 
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  const [purchaseComplete, setPurchaseComplete] = useState(false)
  
  const { uploadFile, uploading, uploadProgress, uploadError } = useUpload()

  const handleFileSelect = async (file) => {
    setSelectedFile(file)
    setAnalysisResult(null)
    setPurchaseComplete(false)
    
    if (file) {
      const url = await uploadFile(file)
      if (url && url.startsWith('http')) {
        // Use original Firebase URL directly - let the MediaPlayer handle CORS fallback
        console.log('Using direct Firebase URL:', url)
        setFileUrl(url)
      } else {
        console.error('Invalid URL received:', url)
        setFileUrl(null)
      }
    } else {
      setFileUrl(null)
    }
  }

  const handleAnalyze = async () => {
    if (!fileUrl) return

    setAnalyzing(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/analyse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl })
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysisResult({
          ...result,
          audioUrl: fileUrl
        })
      } else {
        console.error('Analysis failed: Server responded with error')
        setAnalysisResult(null)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      setAnalysisResult(null)
    }
    setAnalyzing(false)
  }

  const resetSession = () => {
    setSelectedFile(null)
    setFileUrl(null)
    setAnalysisResult(null)
    setPurchaseComplete(false)
    setPlaying(false)
  }

  const handlePurchase = (transaction) => {
    setPurchaseComplete(true)
  }



  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Beat Analysis</h1>
        {(selectedFile || analysisResult) && (
          <button
            onClick={resetSession}
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Session</span>
          </button>
        )}
      </div>

      <TestApi />

      {!selectedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Upload Your Beat</h2>
          <Upload 
            onFileSelect={handleFileSelect} 
            uploading={uploading} 
            uploadProgress={uploadProgress}
          />
          {uploadError && (
            <p className="text-red-500 text-sm mt-2">Upload failed: {uploadError}</p>
          )}
        </div>
      )}

      {selectedFile && fileUrl && !uploading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Audio Preview</h2>
          <SimpleAudioPlayer 
            audioUrl={fileUrl} 
          />
          
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !fileUrl}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze Beat</span>
              )}
            </button>
          </div>
        </div>
      )}

      {analysisResult && !purchaseComplete && (
        <ResultCard result={analysisResult} onBuy={handlePurchase} />
      )}

      {purchaseComplete && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
          <div className="text-green-600 dark:text-green-400 text-lg font-semibold mb-2">
            Purchase Complete! 🎉
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm">
            Analysis data has been saved to your history. Check the History tab to view all your purchases.
          </p>
        </div>
      )}
    </div>
  )
}

export default Dashboard 