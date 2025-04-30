import { createApp } from 'vue'
import App from './App.vue'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import router from './router'

// main.js 또는 main.ts 상단에 추가
window.global = window

const app = createApp(App)
app.use(router)
app.use(VCalendar, {})
app.mount('#app')
