import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase.js'

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const uploadFile = async (file) => {
    if (!file) return null

    setUploading(true)
    setUploadError(null)

    try {
      const storageRef = ref(storage, `audio/${Date.now()}_${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      setUploading(false)
      return downloadURL
    } catch (error) {
      setUploadError(error.message)
      setUploading(false)
      return null
    }
  }

  return { uploadFile, uploading, uploadError }
} 