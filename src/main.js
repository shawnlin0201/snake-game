import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/assets/styles/base.css'
import 'nes.css/css/nes.min.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
