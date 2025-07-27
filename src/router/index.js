import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/Index.vue')
  },
  {
    name: 'CoorPickConvert',
    path: '/coor-pick-convert',
    component: () => import('@/views/openlayers/CoorPickConvert.vue')
  },
  {
    name: 'MLQuickStart',
    path: '/ml-quick-start',
    component: () => import('@/views/maplibre/QuickStart.vue')
  },
  {
    name: 'GaodeOnlineTile',
    path: '/gaode-online-tile',
    component: () => import('@/views/openlayers/GaodeOnlineTile.vue')
  },
  {
    name: 'DataType',
    path: '/data-type',
    component: () => import('@/views/openlayers/DataType.vue')
  },
  {
    name: 'MapColor',
    path: '/map-color',
    component: () => import('@/views/openlayers/MapColor.vue')
  },
  {
    name: 'Heatmap',
    path: '/heatmap',
    component: () => import('@/views/openlayers/HeatMap.vue')
  },
  {
    name: 'EmbedPage',
    path: '/embed-page',
    component: () => import('@/views/openlayers/EmbedPage.vue')
  },
  {
    name: 'EmbedPageParent',
    path: '/embed-page-parent',
    component: () => import('@/views/openlayers/EmbedPageParent.vue')
  },
  {
    name: 'MeasureLength',
    path: '/measure-length',
    component: () => import('@/views/openlayers/MeasureLength.vue')
  },
  {
    name: 'MapParam',
    path: '/map-param',
    component: () => import('@/views/openlayers/MapParam.vue')
  },
  {
    name: 'DataDisplay',
    path: '/data-display',
    component: () => import('@/views/openlayers/DataDisplay.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
