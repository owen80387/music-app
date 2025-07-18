import React, { useState } from 'react'
import { Upload as UploadIcon, X, CheckCircle } from 'lucide-react'

function Upload({ onFileSelect, uploading, uploadProgress = 0 }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    onFileSelect(null)
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {uploadProgress === 100 ? (
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                ) : (
                  <UploadIcon className="w-8 h-8 text-blue-500 mr-3" />
                )}
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={clearFile}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {uploading && (
              <div className="space-y-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    {uploadProgress < 100 ? 'Uploading your beat...' : 'Upload complete!'}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ease-out ${
                      uploadProgress === 100 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  >
                    <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                {uploadProgress < 100 && (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      Processing...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-sm font-medium">
                Drop your audio file here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports MP3, WAV, FLAC and other audio formats
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload 