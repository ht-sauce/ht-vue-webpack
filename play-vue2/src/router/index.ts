import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue'),
  },
  // {
  //   path: '/test',
  //   component: () => import('@/pages/test/index.vue'),
  // },
]

const router = new Router({
  scrollBehavior: () => ({ y: 0, x: 0 }),
  mode: 'history',
  routes,
  base: '/',
})
export default router
