import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import 'vant/lib/index.css'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'video.js/dist/video-js.css'
import '@/assets/css/main.css'
import i18n from '@/lang'
import { setupStore } from '@/store'
const app = createApp(App)

// 挂载vuex状态管理
setupStore(app)
app.use(router)
app.use(i18n)
app.mount('#app')
