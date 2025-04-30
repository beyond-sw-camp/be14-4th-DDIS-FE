import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const instance = axios.create({
  baseURL: 'http://localhost:8080',  
})

instance.interceptors.request.use(config => {
  const authStore = useAuthStore()

  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

export default instance