import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        refreshToken: null,
        user: {
        nickname: '',
        email: '',
        image: '',
        }
    }),
    actions: {
        loadTokens() {
        this.accessToken = localStorage.getItem('accessToken')
        this.refreshToken = localStorage.getItem('refreshToken')
        },
        async fetchUserProfile() {
        if (!this.accessToken) return
          const res = await fetch('http://localhost:3001/profiles/2') // 👈 토큰에 맞는 사용자로 변경 가능
        const data = await res.json()
        this.user = data
        },
        logout() {
        this.clearTokens()
        this.user = { nickname: '', email: '', image: '' }
        },
        // 기존 setTokens, clearTokens 생략
    },

actions: {
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },
    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    loadTokens() {
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
    },
  }
})