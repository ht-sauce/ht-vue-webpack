import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/test',
    component: () => import('@/pages/test/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/vue-webpack'),
  routes,
})
export default router
