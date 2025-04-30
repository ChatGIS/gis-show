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
          <div v-for="(line, index) of lines" class="line-item">
            <div class="line-header">
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
import { getLength } from 'ol/sphere'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'
import * as huanyu from 'huanyu'

const center = [117.01533, 36.661184]
const map = ref(null)
const drawSource = new VectorSource()
const drawLayer = new VectorLayer({
  source: drawSource,
  style: new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 3
    })
  })
})
let draw = null
let overlays = []
let totalOverlay = null
const lines = ref([])
const sectionOriginDistances = []
const sectionOriginDistancesPlus = []

function clearOverlays() {
  overlays.forEach((o) => map.value.removeOverlay(o))
  overlays = []
  if (totalOverlay) {
    map.value.removeOverlay(totalOverlay)
    totalOverlay = null
  }
}

onMounted(() => {
  const baseLayer = new TileLayer({
    source: new ImageTileSource({
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
  })

  map.value = new Map({
    target: 'map-container',
    layers: [baseLayer, drawLayer],
    view: new View({
      center: center,
      zoom: 12,
      projection: 'EPSG:4326'
    })
  })

  draw = new Draw({
    source: drawSource,
    type: 'LineString',
    style: null
  })

  map.value.addInteraction(draw)

  let sketch = null
  let lastCoords = null

  draw.on('drawstart', (evt) => {
    clearOverlays()
    sketch = evt.feature
    lastCoords = null
    const line = {
      total: 0,
      totalPlus: 0,
      sections: [],
      sectionsPlus: []
    }
    lines.value.push(line)
    console.log('drawstart......')
    let lengthGeometryCoordinates = 2
    sketch.getGeometry().on('change', (e) => {
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
          1
        )
        setTotalDistance()
      }
    })
  })

  draw.on('drawend', (evt) => {
    setTotalDistance()
    const lastIndexLines = lines.value.length - 1
    const lineCoordinates = evt.feature.getGeometry().getCoordinates()
    const lastCoordinate = lineCoordinates[lineCoordinates.length - 1]
    const text = `第${lines.value.length}条线总长：${lines.value[lastIndexLines].total}`
    createOverlay(text, lastCoordinate, 2)
    sectionOriginDistances.length = 0
    sectionOriginDistancesPlus.length = 0
  })
})
function formatLength(line) {
  const length = getLength(line)
  return length > 1000
    ? (length / 1000).toFixed(2) + ' km'
    : length.toFixed(2) + ' m'
}
function formatDistance(distance) {
  return distance > 1000
    ? (distance / 1000).toFixed(2) + ' km'
    : distance.toFixed(2) + ' m'
}

function createOverlay(text, position, type) {
  const el = document.createElement('div')
  el.className = 'measure-popup-item'
  if (type == 1) {
    el.className = 'measure-popup-item'
  } else if (type == 2) {
    el.className = 'measure-total'
  }
  el.innerText = text
  totalOverlay = new Overlay({
    element: el,
    positioning: 'top-right',
    stopEvent: false,
    offset: [0, 0],
    position: position
  })
  map.value.addOverlay(totalOverlay)
}
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
  background-color: var(--el-border-color);
  border-radius: 5px;
  padding: 6px 8px;
}
.measure-container {
  width: 100vw;
  height: 100vh;
}
.measure-popup {
  background: #409eff;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  pointer-events: none;
}
.measure-popup.total {
  background: #67c23a;
  font-weight: bold;
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
  background-color: red;
  height: 24px;
  border-radius: 4px;
  color: white;
  padding: 4px;
}
</style>
