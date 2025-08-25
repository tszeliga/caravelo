import type { RouteRecordRaw } from 'vue-router'

type AbsolutePath = `/${string}`
type Feature = 'back-office'

type RouteDef = {
  name: string
  path: AbsolutePath
  meta: {
    title: string
    feature: Feature
  }
}

export const BACK_OFFICE = {
  MAIN: {
    name: 'BackOffice:Main',
    path: '/back-office',
    meta: {
      title: 'Flight Subscription Management - Caravelo Back Office',
      feature: 'back-office'
    }
  }
} satisfies Record<string, RouteDef>

// 3) Build actual routes
export const backOfficeRoutes: RouteRecordRaw[] = [
  {
    path: BACK_OFFICE.MAIN.path,
    name: BACK_OFFICE.MAIN.name,
    component: () => import('@/features/back-office/views/BackOffice.vue'),
    meta: BACK_OFFICE.MAIN.meta
  }
]
