<template>
  <el-watermark
    id="watermark-container"
    :content="['https://chatgis.space', '@ChatGIS']"
  >
    <div id="map" class="map"></div>
    <SideNav />
    <FooterInfo />

    <!-- 添加悬浮控制框 -->
    <div class="control-panel">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>热力图参数控制</span>
          </div>
        </template>
        <div class="control-item">
          <span>点数量(count)：</span>
          <el-slider
            v-model="heatmapParams.count"
            :min="100"
            :max="2000"
            :step="100"
            @change="updateHeatmap"
          />
        </div>
        <div class="control-item">
          <span>模糊度(blur)：</span>
          <el-slider
            v-model="heatmapParams.blur"
            :min="5"
            :max="30"
            :step="1"
            @change="updateHeatmapStyle"
          />
        </div>
        <div class="control-item">
          <span>半径(radius)：</span>
          <el-slider
            v-model="heatmapParams.radius"
            :min="5"
            :max="30"
            :step="1"
            @change="updateHeatmapStyle"
          />
        </div>
      </el-card>
    </div>
  </el-watermark>
</template>

<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer, Heatmap as HeatmapLayer } from 'ol/layer'
import { ImageTile as ImageTileSource, Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { onMounted, ref } from 'vue'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'

const center = [117.01533, 36.661184]
let map = null
let vectorSource = null
let heatmapLayer = null

// 热力图参数的响应式数据
const heatmapParams = ref({
  count: 1000,
  blur: 13,
  radius: 14
})

// 生成热力图点数据的函数
const generateFeatures = (count) => {
  const features = []
  for (let i = 0; i < count; i++) {
    const coordinates = [
      center[0] + Math.random() * 1,
      center[1] + Math.random() * 0.5
    ]
    const feature = new Feature({
      geometry: new Point(coordinates)
    })
    feature.set('weight', Math.random() * 100)
    features.push(feature)
  }
  return features
}

// 更新热力图数据的函数
const updateHeatmap = () => {
  if (vectorSource) {
    vectorSource.clear()
    const features = generateFeatures(heatmapParams.value.count)
    vectorSource.addFeatures(features)
  }
}

// 更新热力图样式的函数
const updateHeatmapStyle = () => {
  if (heatmapLayer) {
    heatmapLayer.setBlur(heatmapParams.value.blur)
    heatmapLayer.setRadius(heatmapParams.value.radius)
  }
}

// 创建矢量数据源
vectorSource = new VectorSource({
  features: generateFeatures(heatmapParams.value.count)
})

// 创建热力图图层
heatmapLayer = new HeatmapLayer({
  source: vectorSource,
  blur: heatmapParams.value.blur,
  radius: heatmapParams.value.radius,
  weight: function (feature) {
    return feature.get('weight')
  }
})

// 创建底图图层
const baseLayer = new TileLayer({
  source: new ImageTileSource({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  })
})

onMounted(() => {
  map = new Map({
    target: 'map',
    layers: [baseLayer, heatmapLayer],
    view: new View({
      center: [center[0] + 0.5, center[1] + 0.25],
      zoom: 11,
      projection: 'EPSG:4326'
    })
  })
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}

.control-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 300px;
}

.control-item {
  margin-bottom: 20px;
}

.control-item span {
  display: block;
  margin-bottom: 8px;
}

.card-header {
  font-weight: bold;
}
</style>
