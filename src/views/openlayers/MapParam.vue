<template>
  <el-watermark
    id="watermark-container"
    :content="['https://chatgis.space', '@ChatGIS']"
  >
    <div id="map-container"></div>
    <SideNav />
    <FooterInfo />

    <!-- 坐标面板 -->
    <div class="coordinate-panel">
      <el-card>
        <el-form :model="mapParams" label-width="auto">
          <el-form-item label="精度">
            <el-input-number
              size="small"
              v-model="mapParams.coorDecimal"
              :min="0"
              :max="14"
            />
          </el-form-item>
          <el-form-item label="层级">
            <el-input
              class="input-coordinate"
              v-model="mapParams.zoom"
              placeholder="层级"
            />
            <el-button class="btn-copy" @click="copyCoordinates(mapParams.zoom)"
              >复制</el-button
            >
          </el-form-item>
          <el-form-item label="中心点">
            <el-input
              class="input-coordinate"
              v-model="mapParams.center"
              placeholder="中心点坐标"
            />
            <el-button
              class="btn-copy"
              @click="copyCoordinates(mapParams.center)"
              >复制</el-button
            >
          </el-form-item>
          <el-form-item label="左下角">
            <el-input
              class="input-coordinate"
              v-model="mapParams.leftBottom"
              placeholder="左下角坐标"
            />
            <el-button
              class="btn-copy"
              @click="copyCoordinates(mapParams.leftBottom)"
              >复制</el-button
            >
          </el-form-item>
          <el-form-item label="右上角">
            <el-input
              class="input-coordinate"
              v-model="mapParams.rightTop"
              placeholder="右上角坐标"
            />
            <el-button
              class="btn-copy"
              @click="copyCoordinates(mapParams.rightTop)"
              >复制</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-watermark>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { ImageTile as ImageTileSource, Vector as VectorSource } from 'ol/source'
import { Style, Icon, Text, Fill } from 'ol/style'
import { Point } from 'ol/geom'
import { ElMessage } from 'element-plus'
import * as huanyu from 'huanyu'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'

let map = null
const mapParams = ref({
  coorDecimal: 6,
  center: [117.01533, 36.661184],
  zoom: 12,
  leftBottom: '',
  rightTop: ''
})
// 初始化地图
onMounted(() => {
  const baseLayer = new TileLayer({
    source: new ImageTileSource({
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
  })

  map = new Map({
    target: 'map-container',
    layers: [baseLayer],
    view: new View({
      center: mapParams.value.center,
      zoom: mapParams.value.zoom,
      projection: 'EPSG:4326'
    })
  })
  map.on('moveend', (evt) => {
    const view = evt.map.getView()
    const center = view.getCenter()
    const zoom = view.getZoom()
    const extent = view.calculateExtent()
    const re = view.getResolution()
    console.log(re, 'reeeeeeeeeeeeeee');
    
    mapParams.value.center = `${center[0].toFixed(mapParams.value.coorDecimal)},${center[1].toFixed(mapParams.value.coorDecimal)}`
    mapParams.value.zoom = zoom.toFixed(mapParams.value.coorDecimal)
    mapParams.value.leftBottom = `${extent[0].toFixed(mapParams.value.coorDecimal)},${extent[1].toFixed(mapParams.value.coorDecimal)}`
    mapParams.value.rightTop = `${extent[2].toFixed(mapParams.value.coorDecimal)},${extent[3].toFixed(mapParams.value.coorDecimal)}`
  })
})
// 复制坐标到剪贴板
const copyCoordinates = (coordinates) => {
  const text = Array.isArray(coordinates) ? coordinates.join(',') : coordinates
  navigator.clipboard
    .writeText(text)
    .then(() => {
      ElMessage.success('坐标已复制到剪贴板')
    })
    .catch((err) => {
      ElMessage.error('复制失败')
    })
}
</script>
<style scoped>
#map-container {
  width: 100%;
  height: 100%;
}

.coordinate-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 400px;
}

.coordinate {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.convert-result {
  display: flex;
  align-items: center;
}
.btn-copy {
  margin-left: 5px;
}
.input-coordinate {
  width: 70%;
}
</style>
