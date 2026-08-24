import { ref } from 'vue'
import client from '@/api/client'

export function useUpload() {
  const progress = ref(0)
  const uploading = ref(false)
  const error = ref(null)

  const uploadFile = async (url, file, fieldName = 'file', extraData = {}) => {
    uploading.value = true
    progress.value = 0
    error.value = null

    const formData = new FormData()
    formData.append(fieldName, file)
    
    Object.keys(extraData).forEach(key => {
      formData.append(key, extraData[key])
    })

    try {
      const response = await client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }
        },
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'File upload failed'
      throw err
    } finally {
      uploading.value = false
    }
  }

  return {
    progress,
    uploading,
    error,
    uploadFile,
  }
}
