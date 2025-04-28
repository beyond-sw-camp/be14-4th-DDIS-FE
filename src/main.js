import { createApp } from 'vue'
import App from './App.vue'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(VCalendar, {})
app.mount('#app')
