<template>
  <el-watermark
    id="watermark-container"
    :content="['https://chatgis.space', '@ChatGIS']"
  >
    <div id="mapContainer"></div>
    <SideNav />
    <FooterInfo />
  </el-watermark>
</template>
<script setup>
import { onMounted } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'

onMounted(() => {
  const map = new maplibregl.Map({
    container: 'mapContainer', // container id
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [0, 0], // starting position [lng, lat]
    zoom: 1 // starting zoom
  })
})
</script>
<style scoped>
#mapContainer {
  height: 100%;
}
</style>
