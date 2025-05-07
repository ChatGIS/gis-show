<template>
  <el-watermark
    id="watermark-container"
    :content="['https://chatgis.space', '@ChatGIS']"
  >
    <div id="map" class="map"></div>
    <SideNav />
    <FooterInfo />

    <!-- 添加滤镜控制面板 -->
    <div class="filter-panel">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>地图滤镜控制</span>
            <div class="preset-filters">
              <el-button size="small" @click="applyPreset('normal')"
                >正常</el-button
              >
              <el-button size="small" @click="applyPreset('dark')"
                >暗色</el-button
              >
              <el-button size="small" @click="applyPreset('invert')"
                >反转</el-button
              >
              <el-button size="small" @click="applyPreset('vintage')"
                >复古</el-button
              >
              <el-button size="small" @click="applyPreset('dramatic')"
                >戏剧</el-button
              >
              <el-button size="small" @click="applyPreset('blackWhite')"
                >黑白</el-button
              >
              <el-button size="small" @click="applyPreset('warm')"
                >暖色</el-button
              >
              <el-button size="small" @click="applyPreset('cool')"
                >冷色</el-button
              >
            </div>
          </div>
        </template>
        <div class="control-item">
          <span>灰度(grayscale)：{{ filterParams.grayscale }}%</span>
          <el-slider
            v-model="filterParams.grayscale"
            :min="0"
            :max="100"
            :step="1"
            @change="updateFilter"
          />
        </div>
        <div class="control-item">
          <span>反转(invert)：{{ filterParams.invert }}%</span>
          <el-slider
            v-model="filterParams.invert"
            :min="0"
            :max="100"
            :step="1"
            @change="updateFilter"
          />
        </div>
        <div class="control-item">
          <span>亮度(brightness)：{{ filterParams.brightness }}%</span>
          <el-slider
            v-model="filterParams.brightness"
            :min="0"
            :max="200"
            :step="1"
            @change="updateFilter"
          />
        </div>
        <div class="control-item">
          <span>对比度(contrast)：{{ filterParams.contrast }}%</span>
          <el-slider
            v-model="filterParams.contrast"
            :min="0"
            :max="200"
            :step="1"
            @change="updateFilter"
          />
        </div>
        <div class="control-item">
          <span>饱和度(saturate)：{{ filterParams.saturate }}%</span>
          <el-slider
            v-model="filterParams.saturate"
            :min="0"
            :max="200"
            :step="1"
            @change="updateFilter"
          />
        </div>
        <div class="control-item">
          <span>色相旋转(hue-rotate)：{{ filterParams.hueRotate }}度</span>
          <el-slider
            v-model="filterParams.hueRotate"
            :min="0"
            :max="360"
            :step="1"
            @change="updateFilter"
          />
        </div>
        <div class="control-item">
          <span>模糊(blur)：{{ filterParams.blur }}px</span>
          <el-slider
            v-model="filterParams.blur"
            :min="0"
            :max="10"
            :step="0.1"
            @change="updateFilter"
          />
        </div>
        <div class="control-item">
          <span>褐色(sepia)：{{ filterParams.sepia }}%</span>
          <el-slider
            v-model="filterParams.sepia"
            :min="0"
            :max="100"
            :step="1"
            @change="updateFilter"
          />
        </div>
      </el-card>
    </div>
  </el-watermark>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { ImageTile as ImageTileSource } from 'ol/source'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'

const center = [117.01533, 36.661184]
let map = null

// 滤镜参数的响应式数据
const filterParams = ref({
  grayscale: 80,
  invert: 100,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  blur: 0,
  sepia: 0
})

// 预设滤镜参数
const presetFilters = {
  normal: {
    grayscale: 0,
    invert: 0,
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    blur: 0,
    sepia: 0
  },
  dark: {
    grayscale: 80,
    invert: 100,
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    blur: 0,
    sepia: 0
  },
  invert: {
    grayscale: 0,
    invert: 100,
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    blur: 0,
    sepia: 0
  },
  vintage: {
    grayscale: 20,
    invert: 0,
    brightness: 110,
    contrast: 90,
    saturate: 80,
    hueRotate: 20,
    blur: 0,
    sepia: 40
  },
  dramatic: {
    grayscale: 0,
    invert: 0,
    brightness: 110,
    contrast: 150,
    saturate: 140,
    hueRotate: 0,
    blur: 0,
    sepia: 0
  },
  blackWhite: {
    grayscale: 100,
    invert: 0,
    brightness: 100,
    contrast: 120,
    saturate: 0,
    hueRotate: 0,
    blur: 0,
    sepia: 0
  },
  warm: {
    grayscale: 0,
    invert: 0,
    brightness: 105,
    contrast: 100,
    saturate: 120,
    hueRotate: 15,
    blur: 0,
    sepia: 20
  },
  cool: {
    grayscale: 0,
    invert: 0,
    brightness: 100,
    contrast: 100,
    saturate: 120,
    hueRotate: 180,
    blur: 0,
    sepia: 0
  }
}
const baseLayer = new TileLayer({
  source: new ImageTileSource({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  })
})

onMounted(() => {
  map = new Map({
    target: 'map',
    layers: [baseLayer],
    view: new View({
      center: center,
      zoom: 10,
      projection: 'EPSG:4326'
    })
  })
  applyPreset('invert')
})

// 应用预设滤镜的函数
const applyPreset = (presetName) => {
  const preset = presetFilters[presetName]
  if (preset) {
    Object.assign(filterParams.value, preset)
    updateFilter()
  }
}

// 更新滤镜效果的函数
const updateFilter = () => {
  if (!map) return
  const filter = [
    `grayscale(${filterParams.value.grayscale}%)`,
    `invert(${filterParams.value.invert}%)`,
    `brightness(${filterParams.value.brightness}%)`,
    `contrast(${filterParams.value.contrast}%)`,
    `saturate(${filterParams.value.saturate}%)`,
    `hue-rotate(${filterParams.value.hueRotate}deg)`,
    `blur(${filterParams.value.blur}px)`,
    `sepia(${filterParams.value.sepia}%)`
  ].join(' ')

  baseLayer.on('prerender', (evt) => {
    if (evt.context) {
      const context = evt.context
      context.filter = filter
      context.globalCompositeOperation = 'source-over'
    }
  })
  map.render() // 触发地图重新渲染
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
.el-button {
  margin-left: 0px;
}
.filter-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 300px;
  max-height: 90vh;
  overflow-y: auto;
}

.control-item {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preset-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
