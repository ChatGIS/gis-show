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
        <el-tabs v-model="activeTab">
          <!-- 坐标拾取 -->
          <el-tab-pane label="坐标拾取" name="tabPick">
            <el-form
              :model="formPick"
              label-width="auto"
            >
              <el-form-item label="坐标精度">
                <el-input-number
                  size="small"
                  v-model="formPick.coorDecimal"
                  :min="0"
                  :max="14"
                />
              </el-form-item>
              <el-form-item label="高德坐标">
                <el-input
                  class="input-coordinate"
                  v-model="formPick.coordinateGCJ02"
                  placeholder="高德坐标（GCJ02）"
                />
                <el-button
                  class="btn-copy"
                  @click="copyCoordinates(formPick.coordinateGCJ02)"
                  >复制</el-button
                >
              </el-form-item>
              <el-form-item label="百度坐标">
                <el-input
                  class="input-coordinate"
                  v-model="formPick.coordinateBD09"
                  placeholder="百度坐标（BD09）"
                />
                <el-button
                  class="btn-copy"
                  @click="copyCoordinates(formPick.coordinateBD09)"
                  >复制</el-button
                >
              </el-form-item>
              <el-form-item label="八四坐标">
                <el-input
                  class="input-coordinate"
                  v-model="formPick.coordinateWGS84"
                  placeholder="84坐标（WGS84）"
                />
                <el-button
                  class="btn-copy"
                  @click="copyCoordinates(formPick.coordinateWGS84)"
                  >复制</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 坐标输入 -->
          <el-tab-pane label="坐标输入" name="tabInput">
            <el-form :model="formInput" label-width="auto">
              <el-form-item label="坐标精度">
                <el-input-number
                  size="small"
                  v-model="formInput.coorDecimal"
                  :min="0"
                  :max="14"
                />
              </el-form-item>
              <el-form-item label="坐标类型">
                <el-radio-group v-model="formInput.type">
                  <el-radio label="gcj02">高德</el-radio>
                  <el-radio label="wgs84">八四</el-radio>
                  <el-radio label="bd09">百度</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="输入坐标">
                <el-input v-model="formInput.coordinateInput" placeholder="支持格式：经度, 纬度" />
              </el-form-item>
              <el-form-item label="高德坐标">
                <el-input
                  class="input-coordinate"
                  v-model="formInput.coordinateGCJ02"
                  placeholder="高德坐标（GCJ02）"
                />
                <el-button
                  class="btn-copy"
                  @click="copyCoordinates(formInput.coordinateGCJ02)"
                  >复制</el-button
                >
              </el-form-item>
              <el-form-item label="百度坐标">
                <el-input
                  class="input-coordinate"
                  v-model="formInput.coordinateBD09"
                  placeholder="百度坐标（BD09）"
                />
                <el-button
                  class="btn-copy"
                  @click="copyCoordinates(formInput.coordinateBD09)"
                  >复制</el-button
                >
              </el-form-item>
              <el-form-item label="八四坐标">
                <el-input
                  class="input-coordinate"
                  v-model="formInput.coordinateWGS84"
                  placeholder="84坐标（WGS84）"
                />
                <el-button
                  class="btn-copy"
                  @click="copyCoordinates(formInput.coordinateWGS84)"
                  >复制</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </el-watermark>
</template>

<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { ImageTile as ImageTileSource } from 'ol/source'
import { ref, onMounted } from 'vue'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'
import { ElMessage } from 'element-plus'

const center = [117.01533, 36.661184]
let map = null
const activeTab = ref('tabPick')
const formPick = ref({
  coorDecimal: 6,
  coordinateInput: '',
  coordinateGCJ02: '',
  coordinateBD09: '',
  coordinateWGS84: ''
})
const formInput = ref({
  type: 'gcj02',
  coorDecimal: 6,
  coordinateGCJ02: '',
  coordinateBD09: '',
  coordinateWGS84: ''
})

// 复制坐标到剪贴板
const copyCoordinates = (coordinates) => {
  const text = Array.isArray(coordinates) ? coordinates.join(',') : coordinates
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('坐标已复制到剪贴板')
  }).catch((err) => {
    ElMessage.error('复制失败')
  })
}
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
      center: center,
      zoom: 12,
      projection: 'EPSG:4326'
    })
  })

  // 添加点击事件监听
  map.on('click', (evt) => {
    const coordinatePicked = evt.coordinate.map((coord) =>
      coord.toFixed(formPick.value.coorDecimal)
    )
    formPick.value.coordinateGCJ02 = `${coordinatePicked[0]}, ${coordinatePicked[1]}`
    formPick.value.coordinateBD09 = `${coordinatePicked[0]}, ${coordinatePicked[1]}`
    formPick.value.coordinateWGS84 = `${coordinatePicked[0]}, ${coordinatePicked[1]}`
  })
})
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
