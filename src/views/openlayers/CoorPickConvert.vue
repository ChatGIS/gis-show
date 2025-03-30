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
            <el-form :model="formPick" label-width="auto">
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
              <el-form-item label="坐标类型" @change="changeCoordinateType">
                <el-radio-group v-model="formInput.type">
                  <el-radio label="gcj02">高德</el-radio>
                  <el-radio label="wgs84">八四</el-radio>
                  <el-radio label="bd09">百度</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="输入坐标">
                <el-input
                  v-model="formInput.coordinateInput"
                  placeholder="支持格式：lon, lat、lon lat、POINT(lon lat)"
                  @input="handleInputCoordinate"
                />
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
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { ImageTile as ImageTileSource, Vector as VectorSource } from 'ol/source'
import { Point } from 'ol/geom'
import { ref, onMounted } from 'vue'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'
import { ElMessage } from 'element-plus'
import * as huanyu from 'huanyu'
import imageBlue from '@/assets/images/locate-blue.png'
import imageRed from '@/assets/images/locate-red.png'
import imageGreen from '@/assets/images/locate-green.png'
import { Style, Icon, Text, Fill } from 'ol/style'

const center = [117.01533, 36.661184]
let map = null
const activeTab = ref('tabPick')
const formPick = ref({
  coorDecimal: 6,
  coordinateGCJ02: '',
  coordinateBD09: '',
  coordinateWGS84: ''
})
const formInput = ref({
  type: 'gcj02',
  coorDecimal: 6,
  coordinateInput: '',
  coordinateGCJ02: '',
  coordinateBD09: '',
  coordinateWGS84: ''
})
// 定位图层
const locateSource = new VectorSource({})
const locateLayer = new VectorLayer({
  source: locateSource
})
/**
 * 获取定位图标样式
 * @param typeText 类型文本
 */
const getLocateStyle = (typeText) => {
  let imageSrc = imageBlue
  let colorBackground = '#0C86E3'
  if (typeText === 'BD09') {
    imageSrc = imageGreen
    colorBackground = '#30AD98'
  } else if (typeText === 'WGS84') {
    imageSrc = imageRed
    colorBackground = '#E16531'
  }
  return new Style({
    image: new Icon({
      src: imageSrc,
      size: [64, 64],
      offset: [-17, -5]
    }),
    text: new Text({
      text: typeText,
      font: '15px sans-serif',
      offsetX: -3,
      offsetY: -38,
      fill: new Fill({
        color: 'white'
      }),
      backgroundFill: new Fill({
        color: colorBackground
      })
    })
  })
}
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
// 初始化地图
onMounted(() => {
  const baseLayer = new TileLayer({
    source: new ImageTileSource({
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
  })

  map = new Map({
    target: 'map-container',
    layers: [baseLayer, locateLayer],
    view: new View({
      center: center,
      zoom: 12,
      projection: 'EPSG:4326'
    })
  })

  // 添加点击事件监听
  map.on('click', (evt) => {
    if (activeTab.value == 'tabPick') {
      const coordinatePicked = evt.coordinate
      const coordWGS84 = huanyu.convertGCJ02ToWGS84(
        coordinatePicked[0],
        coordinatePicked[1]
      )
      const coordBD09 = huanyu.convertGCJ02ToBD09(
        coordinatePicked[0],
        coordinatePicked[1]
      )
      formPick.value.coordinateGCJ02 = `${coordinatePicked[0].toFixed(formPick.value.coorDecimal)}, ${coordinatePicked[1].toFixed(formPick.value.coorDecimal)}`
      formPick.value.coordinateBD09 = `${coordBD09.lon.toFixed(formPick.value.coorDecimal)}, ${coordBD09.lat.toFixed(formPick.value.coorDecimal)}`
      formPick.value.coordinateWGS84 = `${coordWGS84.lon.toFixed(formPick.value.coorDecimal)}, ${coordWGS84.lat.toFixed(formPick.value.coorDecimal)}`
      handleMapPointDisplay()
      return
    } else {
      ElMessage.warning('如需拾取坐标请切换到【坐标拾取】功能页。')
    }
  })
})
/**
 * 处理输入的坐标变化事件
 * @param coordinate 坐标文本
 */
const handleInputCoordinate = (coordinate) => {
  coordinate = coordinate.trim()
  const match = coordinate.match(/^point\s*\(([^)]+)\)$/i);
  if (match) {
    // 符合正则表达式，match[1] 是括号内内容
    coordinate = match[1];
  } 
  const regex = /^-?\d+(\.\d+)?[\s,]+-?\d+(\.\d+)?$/
  const isValid = regex.test(coordinate)
  if (isValid) {
    const parts = coordinate.split(/[,\s]+/)
    const lon = parseFloat(parts[0])
    const lat = parseFloat(parts[1])
    convertCoordinateByType(lon, lat)
  } else {
    ElMessage.warning('请输入正确的坐标格式')
    return
  }
}
const changeCoordinateType = () => {
  handleInputCoordinate(formInput.value.coordinateInput)
}
const convertCoordinateByType = (lon, lat) => {
  let coordGCJ02, coordBD09, coordWGS84
  if (formInput.value.type === 'gcj02') {
    coordGCJ02 = { lon, lat }
    coordBD09 = huanyu.convertGCJ02ToBD09(lon, lat)
    coordWGS84 = huanyu.convertGCJ02ToWGS84(lon, lat)
  } else if (formInput.value.type === 'bd09') {
    coordBD09 = { lon, lat }
    coordGCJ02 = huanyu.convertBD09ToGCJ02(lon, lat)
    coordWGS84 = huanyu.convertBD09ToWGS84(lon, lat)
  } else if (formInput.value.type === 'wgs84') {
    coordWGS84 = { lon, lat }
    coordGCJ02 = huanyu.convertWGS84ToGCJ02(lon, lat)
    coordBD09 = huanyu.convertWGS84ToBD09(lon, lat)
  }
  formInput.value.coordinateGCJ02 = `${coordGCJ02.lon.toFixed(formInput.value.coorDecimal)}, ${coordGCJ02.lat.toFixed(formInput.value.coorDecimal)}`
  formInput.value.coordinateBD09 = `${coordBD09.lon.toFixed(formInput.value.coorDecimal)}, ${coordBD09.lat.toFixed(formInput.value.coorDecimal)}`
  formInput.value.coordinateWGS84 = `${coordWGS84.lon.toFixed(formInput.value.coorDecimal)}, ${coordWGS84.lat.toFixed(formInput.value.coorDecimal)}`
  handleMapPointDisplay()
}
/**
 * 处理地图上的点的显示
 */
const handleMapPointDisplay = () => {
  let coordinateGCJ02, coordinateBD09, coordinateWGS84
  if (activeTab.value === 'tabPick') {
    coordinateGCJ02 = formPick.value.coordinateGCJ02.split(',')
    coordinateBD09 = formPick.value.coordinateBD09.split(',')
    coordinateWGS84 = formPick.value.coordinateWGS84.split(',')
  } else {
    coordinateGCJ02 = formInput.value.coordinateGCJ02.split(',')
    coordinateBD09 = formInput.value.coordinateBD09.split(',')
    coordinateWGS84 = formInput.value.coordinateWGS84.split(',')
  }
  const featureGCJ02 = new Feature(new Point(coordinateGCJ02))
  const featureBD09 = new Feature(new Point(coordinateBD09))
  const featureWGS84 = new Feature(new Point(coordinateWGS84))
  featureGCJ02.setStyle(getLocateStyle('GCJ02'))
  featureBD09.setStyle(getLocateStyle('BD09'))
  featureWGS84.setStyle(getLocateStyle('WGS84'))
  locateSource.clear()
  locateSource.addFeatures([featureGCJ02, featureBD09, featureWGS84])
  if (activeTab.value === 'tabPick') {
    if (map.getView().getZoom() < 16) {
      map.getView().animate({
        center: coordinateGCJ02,
        zoom: 16
      })
    }
  } else {
    map.getView().animate({
      center: coordinateGCJ02,
      zoom: 16
    })
  }
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
