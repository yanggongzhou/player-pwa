import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { App } from 'vue';
import { createRouterGuards } from '@/router/router-guards';
import LayoutCom from '@/components/layout/layout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/theater',
    component: LayoutCom,
    children: [
      {
        path: '/drama',
        name: 'drama',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/drama/Drama.vue')
      },
      {
        path: '/theater',
        name: 'theater',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/theater/Theater.vue')
      },
      {
        path: '/self',
        name: 'self',
        component: () => import(/* webpackChunkName: "about" */ '@/views/self/Self.vue')
      },
    ]
  },
  {
    path: '/player',
    name: 'player',
    component: () => import(/* webpackChunkName: "about" */ '@/views/player/PlayerVideo.vue')
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
