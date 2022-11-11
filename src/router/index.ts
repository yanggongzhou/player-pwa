import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { App } from 'vue';
import { createRouterGuards } from '@/router/router-guards';
import PlayerVideo from '@/views/player/PlayerVideo.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'theater',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/theater/Theater.vue')
  },
  {
    path: '/player',
    name: 'player',
    component: PlayerVideo
  },
  // {
  //   path: '/theater',
  //   name: 'theater',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/theater/Theater.vue')
  // },
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
