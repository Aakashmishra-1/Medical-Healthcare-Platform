import axios from 'axios'
import { API_BASE_URL } from '../config'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hc_token')
      localStorage.removeItem('hc_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
