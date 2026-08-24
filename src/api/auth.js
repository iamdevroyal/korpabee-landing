import client from './client'

export const register = (payload) => client.post('/auth/register', payload)

export const login = (payload) => client.post('/auth/login', payload)

export const joinWaitlist = (payload) => client.post('/auth/waitlist', payload)

export const logout = () => client.post('/auth/logout')

export const logoutAll = () => client.post('/auth/logout/all')

export const verifyPhone = (payload) => client.post('/auth/verify/phone', payload)

export const sendPhoneOTP = (payload) => client.post('/auth/verify/phone/send', payload)

export const verifyEmail = (payload) => client.post('/auth/verify/email', payload)

export const sendEmailOTP = (payload) => client.post('/auth/verify/email/send', payload)

export const submitNYSC = (formData) => {
  return client.post('/auth/nysc/verify', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const checkNYSCStatus = () => client.get('/auth/nysc/status')

// QR-based Corper registration
export const verifyNyscQr = (payload) => client.post('/auth/nysc/verify-qr', payload)

export const registerCorper = (payload) => client.post('/auth/register', payload)

export const getReferrals = () => client.get('/me/referrals')

export const forgotPassword = (email) => client.post('/auth/password/forgot', { email })

export const verifyPasswordOtp = (email, otp) => client.post('/auth/password/verify-otp', { email, otp })

export const resetPassword = (payload) => client.post('/auth/password/reset', payload)

// ─── Biometric Auth API ────────────────────────────────────────────────────
// GET /auth/biometric/status?device_id=xxx — public, no token needed
export const getBiometricStatus = (deviceId) =>
  client.get('/auth/biometric/status', { params: { device_id: deviceId } })

// POST /auth/biometric/login — passwordless login for enrolled devices
export const biometricLogin = (deviceId) =>
  client.post('/auth/biometric/login', { device_id: deviceId })

// POST /auth/biometric/enroll — mark device as enrolled (call after prompt success)
export const enrollBiometric = (deviceId) =>
  client.post('/auth/biometric/enroll', { device_id: deviceId })

// POST /auth/biometric/confirm — issue 90s single-use nonce for a transfer
export const confirmBiometric = (deviceId) =>
  client.post('/auth/biometric/confirm', { device_id: deviceId })

