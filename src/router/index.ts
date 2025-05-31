import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'anitable',
      component: () => import('../views/AniTable.vue'),
    },
    {
      path: '/creater',
      name: 'creater',
      component: () => import('../views/Creater.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue'),
    },
  ],
})

export default router
