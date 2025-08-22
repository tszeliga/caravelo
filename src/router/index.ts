import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const ROUTES = {
  BACKOFFICE: {
    name: 'BackOffice',
    path: 'back-office'
  }
} as const

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: `/${ROUTES.BACKOFFICE.path}`
  },
  {
    path: `/${ROUTES.BACKOFFICE.path}`,
    name: `/${ROUTES.BACKOFFICE.name}`,
    component: () => import('@/views/BackOffice.vue'),
    meta: {
      title: 'Flight Subscription Management - Caravelo Back Office'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: `/${ROUTES.BACKOFFICE.path}`
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router