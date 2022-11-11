import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from './router'
import 'vant/lib/index.css'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'video.js/dist/video-js.css'
import '@/assets/css/main.css'
import { setupI18n } from '@/lang'
import { setupStore } from '@/store'
import './registerServiceWorker'
const app = createApp(App)

// 挂载vuex状态管理
setupStore(app)
// 多语言
setupI18n(app)
// 挂载路由
setupRouter(app)
// 路由准备就绪后挂载APP实例
router.isReady().then(() => app.mount('#app'))
