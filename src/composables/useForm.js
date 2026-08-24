import { ref } from 'vue'

export function useForm(initialFields = {}) {
  const fields = ref({ ...initialFields })
  const errors = ref({})
  const loading = ref(false)

  const reset = () => {
    fields.value = { ...initialFields }
    errors.value = {}
    loading.value = false
  }

  const setErrors = (apiErrors) => {
    errors.value = {}
    if (typeof apiErrors === 'object') {
      errors.value = apiErrors
    } else {
      errors.value = { general: apiErrors }
    }
  }

  const submit = async (submitCallback) => {
    loading.value = true
    errors.value = {}
    try {
      const result = await submitCallback(fields.value)
      return result
    } catch (err) {
      if (err.response?.data?.errors) {
        errors.value = err.response.data.errors
      } else {
        errors.value = { general: err.response?.data?.message || err.message || 'An error occurred' }
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    fields,
    errors,
    loading,
    reset,
    setErrors,
    submit,
  }
}
