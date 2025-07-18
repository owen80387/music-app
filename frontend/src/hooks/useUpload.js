import { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase.js'

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)

  const uploadFile = async (file) => {
    if (!file) return null

    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      const storageRef = ref(storage, `audio/${Date.now()}_${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Calculate progress percentage
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setUploadProgress(Math.round(progress))
          },
          (error) => {
            setUploadError(error.message)
            setUploading(false)
            setUploadProgress(0)
            reject(error)
          },
          async () => {
            // Upload completed successfully
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              
              // Keep progress at 100% for 1 second so user can see completion
              setUploadProgress(100)
              
              setTimeout(() => {
                setUploading(false)
                resolve(downloadURL)
              }, 1000)
            } catch (error) {
              setUploadError(error.message)
              setUploading(false)
              setUploadProgress(0)
              reject(error)
            }
          }
        )
      })
    } catch (error) {
      setUploadError(error.message)
      setUploading(false)
      setUploadProgress(0)
      return null
    }
  }

  return { uploadFile, uploading, uploadProgress, uploadError }
} 