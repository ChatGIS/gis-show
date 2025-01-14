import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  { name: 'Home', path: '/', component: () => import('@/views/home/Index.vue') },
  { name: 'MLQuickStart', path: '/ml-quick-start', component: () => import('@/views/maplibre/QuickStart.vue') },
  { name: 'GaodeOnlineTile', path: '/gaode-online-tile', component: () => import('@/views/openlayers/GaodeOnlineTile.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router