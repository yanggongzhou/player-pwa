import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { App } from 'vue';
import { createRouterGuards } from '@/router/router-guards';
import PlayerVideo from '@/views/PlayerVideo.vue'

const constantFiles = require.context('./constantModules', true, /\.ts$/)
let constantModules: Array<RouteRecordRaw> = []
constantFiles.keys().forEach((key) => {
  if (key === './index.ts') return
  constantModules = constantModules.concat(constantFiles(key).default)
})

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'player',
    component: PlayerVideo
  },
  {
    path: '/home',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/HomeView.vue')
  },
  ...constantModules
]

const router = createRouter({
  // scrollBehavior: () => ({ top: 0 }),
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export function setupRouter (app: App): void {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}

export default router
