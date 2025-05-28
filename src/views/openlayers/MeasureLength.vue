<template>
  <el-watermark
    id="watermark-container"
    :content="['https://chatgis.space', '@ChatGIS']"
  >
    <div class="measure-container">
      <div id="map-container"></div>
      <div class="distance-panel">
        <el-card class="line-tooltip">
          长度说明：第一个值为基于Haversine公式，第二个值基于Vincenty公式，第二个值在长距离上更加准确，但是计算更复杂。
        </el-card>
        <el-card>
          <el-button
            class="clear-btn"
            v-if="lines.length > 0"
            size="small"
            type="primary"
            @click="clearMeasure"
          >
            清除所有测距
          </el-button>
          <div v-for="(line, index) of lines" class="line-item">
            <div class="line-header" :style="{ backgroundColor: line.color }">
              <span
                >第{{ index + 1 }}条线：{{ line.total }} /
                {{ line.totalPlus }}</span
              >
            </div>
            <div v-for="(item, index) of line.sections">
              <span>{{
                index + 1 + '. ' + item + ' / ' + line.sectionsPlus[index]
              }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <SideNav />
    <FooterInfo />
  </el-watermark>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import { Map, View, Overlay } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { ImageTile as ImageTileSource, Vector as VectorSource } from 'ol/source'
import { Style, Stroke } from 'ol/style'
import { LineString } from 'ol/geom'
import { Draw } from 'ol/interaction'
import * as huanyu from 'huanyu'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'

const center = [117.01533, 36.661184]
const lines = ref([])
const sectionOriginDistances = []
const sectionOriginDistancesPlus = []
const map = ref(null)
const baseLayer = new TileLayer({
  source: new ImageTileSource({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  })
})
const drawSource = new VectorSource()
const drawLayer = new VectorLayer({
  source: drawSource
})
let drawInteraction = new Draw({
  source: drawSource,
  type: 'LineString',
  style: null
})
onMounted(() => {
  map.value = new Map({
    target: 'map-container',
    layers: [baseLayer, drawLayer],
    view: new View({
      center: center,
      zoom: 12,
      projection: 'EPSG:4326'
    })
  })
  map.value.addInteraction(drawInteraction)
  handleDrawStart()
  handleDrawEnd()
})
/**
 * 开始绘制
 */
const handleDrawStart = () => {
  drawInteraction.on('drawstart', (evt) => {
    const line = {
      total: 0,
      color: huanyu.getRandomColorFromTheme('brand'),
      totalPlus: 0,
      sections: [],
      sectionsPlus: []
    }
    lines.value.push(line)
    let lengthGeometryCoordinates = 2
    evt.feature.getGeometry().on('change', (e) => {
      const geom = e.target
      const coords = geom.getCoordinates()
      if (coords.length == lengthGeometryCoordinates + 1) {
        const sectionStart = coords[coords.length - 3]
        const sectionEnd = coords[coords.length - 2]
        const distance = huanyu.getDistance(sectionStart, sectionEnd)
        const distancePlus = huanyu.getDistancePlus(sectionStart, sectionEnd)
        sectionOriginDistances.push(distance)
        sectionOriginDistancesPlus.push(distancePlus)
        const distanceFormat = formatDistance(distance)
        const distanceFormatPlus = formatDistance(distancePlus)
        const sectionLine = new LineString([sectionStart, sectionEnd])
        const sectionCenter = sectionLine.getCoordinateAt(0.5)
        const lastIndexLines = lines.value.length - 1
        lines.value[lastIndexLines].sections.push(distanceFormat)
        lines.value[lastIndexLines].sectionsPlus.push(distanceFormatPlus)
        lengthGeometryCoordinates++
        createOverlay(
          lines.value[lastIndexLines].sections.length,
          sectionCenter,
          1,
          lines.value[lastIndexLines].color
        )
        setTotalDistance()
      }
    })
  })
}
/**
 * 结束绘制
 */
const handleDrawEnd = () => {
  drawInteraction.on('drawend', (evt) => {
    setTotalDistance()
    const lastIndexLines = lines.value.length - 1
    const color = lines.value[lastIndexLines].color
    const style = new Style({
      stroke: new Stroke({
        color: color,
        width: 5
      })
    })
    evt.feature.setStyle(style)
    const lineCoordinates = evt.feature.getGeometry().getCoordinates()
    const lastCoordinate = lineCoordinates[lineCoordinates.length - 1]
    const text = `第${lines.value.length}条线总长：${lines.value[lastIndexLines].total}`
    createOverlay(text, lastCoordinate, 2, lines.value[lastIndexLines].color)
    sectionOriginDistances.length = 0
    sectionOriginDistancesPlus.length = 0
  })
}
/**
 * 清除测距内容
 */
const clearMeasure = () => {
  sectionOriginDistances.length = 0
  sectionOriginDistancesPlus.length = 0
  lines.value.length = 0
  drawSource.clear()
  map.value.getOverlays().clear()
}
/**
 * 格式化距离
 * @param distance
 * @returns
 */
const formatDistance = (distance) => {
  return distance > 1000
    ? (distance / 1000).toFixed(2) + ' km'
    : distance.toFixed(2) + ' m'
}
/**
 * 创建Overlay弹窗
 * @param text 弹框文本内容
 * @param position 弹框位置
 * @param type 弹框类型
 */
const createOverlay = (text, position, type, color) => {
  const ele = document.createElement('div')
  ele.style = 'background-color: ' + color
  if (type == 1) {
    ele.className = 'measure-popup-item'
  } else if (type == 2) {
    ele.className = 'measure-total'
  }
  ele.innerText = text
  const overlay = new Overlay({
    element: ele,
    positioning: 'top-right',
    stopEvent: false,
    offset: [0, 0],
    position: position
  })
  map.value.addOverlay(overlay)
}
/**
 * 计算总距离
 */
const setTotalDistance = () => {
  let totalDistance = 0
  let totalDistancePlus = 0
  for (let i = 0; i < sectionOriginDistances.length; i++) {
    totalDistance += sectionOriginDistances[i]
    totalDistancePlus += sectionOriginDistancesPlus[i]
  }
  const totalLen = formatDistance(totalDistance)
  const totalLenPlus = formatDistance(totalDistancePlus)
  const lastIndexLines = lines.value.length - 1
  lines.value[lastIndexLines].total = totalLen
  lines.value[lastIndexLines].totalPlus = totalLenPlus
}
</script>
<style scoped>
#map-container {
  width: 100%;
  height: 100%;
}
.line-item {
  text-align: left;
}
.line-header {
  color: white;
  border-radius: 5px;
  padding: 6px 8px;
}
.measure-container {
  width: 100vw;
  height: 100vh;
}
.distance-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: auto;
  height: auto;
  max-width: 350px;
  max-height: calc(100vh - 30px);
  overflow-y: scroll;
}
.line-tooltip {
  font-size: 12px;
  text-align: left;
  background-color: #dcdfe6;
  width: auto;
}
.clear-btn {
  margin-bottom: 5px;
}
</style>
<style>
.measure-popup-item {
  width: 24px;
  background-color: blue;
  height: 24px;
  border-radius: 12px;
  color: white;
}
.measure-total {
  width: auto;
  height: 24px;
  border-radius: 4px;
  color: white;
  padding: 4px;
}
</style>
