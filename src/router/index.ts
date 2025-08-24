import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

import {
  BACK_OFFICE,
  backOfficeRoutes
} from '@/features/back-office/router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: BACK_OFFICE.MAIN.path
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: BACK_OFFICE.MAIN.path
  },
  ...backOfficeRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
