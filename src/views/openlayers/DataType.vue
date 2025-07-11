<template>
  <el-watermark
    id="watermark-container"
    :content="['https://chatgis.space', '@ChatGIS']"
  >
    <div id="map" class="map"></div>
    <el-card class="box-card">
      <el-form :model="toolForm" label-width="auto" style="max-width: 600px">
        <el-form-item label="绘制类型">
          <el-select
            v-model="selectDrawType"
            class="m-2"
            v-on:change="selectChange"
          >
            <el-option
              v-for="item in toolForm.drawOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开启捕捉">
          <el-switch v-model="toolForm.isSnap" @change="snapSwitch" />
        </el-form-item>
        <el-form-item label="数据精度">
          <el-input-number v-model="toolForm.decimalCoor" :min="0" :max="14" />
        </el-form-item>
        <el-form-item>
          <el-button
            :type="isModify ? '' : 'primary'"
            @click="addInteractionModify"
            >启动修改</el-button
          >
          <el-button type="danger" @click="clearDrawLayer">清空数据</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="margin-left: 16px" @click="openDrawe"
            >打开数据列表</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-drawer v-model="isShowDrawer" :direction="directionDrawer">
      <template #title>
        <h4>数据列表</h4>
      </template>
      <template #default>
        <el-collapse v-model="activeNameCollapse" accordion>
          <el-collapse-item title="GeoJson" name="1">
            <el-input
              v-model="geojsonDrawTextarea"
              :autosize="{ minRows: 8, maxRows: 16 }"
              type="textarea"
            />
          </el-collapse-item>
          <el-collapse-item title="WKT" name="2">
            <el-input
              v-model="wktDrawTextarea"
              :autosize="{ minRows: 8, maxRows: 8 }"
              type="textarea"
            />
          </el-collapse-item>
          <el-collapse-item title="坐标数组(可用于Turf)" name="3">
            <el-input
              v-model="coorArrayTextarea"
              :autosize="{ minRows: 8, maxRows: 8 }"
              type="textarea"
            />
          </el-collapse-item>
          <el-collapse-item title="EsriJson" name="4">
            <el-input
              v-model="esrijsonDrawTextarea"
              :autosize="{ minRows: 8, maxRows: 16 }"
              type="textarea"
            />
          </el-collapse-item>
          <el-collapse-item title="GML" name="5">
            <el-input
              v-model="kmlDrawTextarea"
              :autosize="{ minRows: 8, maxRows: 16 }"
              type="textarea"
            />
          </el-collapse-item>
        </el-collapse>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button
            class="btn-copy"
            @click="copyGeometryData()"
            >复制</el-button
          >
          <el-button @click="closeDrawer">关闭</el-button>
          <!-- <el-button type="primary" @click="downloadFile">下载(.geojson)</el-button> -->
        </div>
      </template>
    </el-drawer>
    <SideNav />
    <FooterInfo />
  </el-watermark>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
import { ImageTile as ImageTileSource, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Draw, Modify, Snap } from 'ol/interaction'
import { GeoJSON, WKT, EsriJSON, KML } from 'ol/format'
// import { saveAs } from 'file-saver'
import gcjMecator from '@/utils/gcj02ToWgs84.js'
import * as huanyu from 'huanyu'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'

const toolForm = reactive({
  isSnap: false,
  decimalCoor: 6,
  drawOptions: [
    {
      value: 'Point',
      label: '点'
    },
    {
      value: 'LineString',
      label: '线'
    },
    {
      value: 'Polygon',
      label: '面'
    },
    {
      value: 'Circle',
      label: '圆'
    }
  ]
})
let map = new Map({})
const gaodeTileLayer = new TileLayer({
  source: new ImageTileSource({
    projection: gcjMecator,
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  })
})

const sourceDraw = new VectorSource()
const vectorDraw = new VectorLayer({
  source: sourceDraw
})

// 注册周期钩子
onMounted(() => {
  map = new Map({
    layers: [gaodeTileLayer, vectorDraw],
    target: 'map',
    view: new View({
      center: [117.00948, 36.66059],
      zoom: 18,
      projection: 'EPSG:4326'
    })
  })
  addInteractions()
})
// 选择框数据
let isModify = ref(false)
const selectDrawType = ref('Point')
// 抽屉相关参数
const isShowDrawer = ref(false)
const directionDrawer = ref('rtl')
const activeNameCollapse = ref('2')
const geojsonDrawTextarea = ref('')
const wktDrawTextarea = ref('')
const coorArrayTextarea = ref('')
const esrijsonDrawTextarea = ref('')
const kmlDrawTextarea = ref('')

const modify = new Modify({ source: sourceDraw })
let draw, snap
// 添加交互
const addInteractions = () => {
  draw = new Draw({
    source: sourceDraw,
    type: selectDrawType.value
  })
  map.addInteraction(draw)
  // 必须在添加“Modify”和“Draw”交互之后添加Snap交互
  snapSwitch()
}
// 修改
const addInteractionModify = () => {
  if (isModify.value) {
    map.removeInteraction(draw)
    map.addInteraction(modify)
  } else {
    map.removeInteraction(modify)
  }
  isModify.value = !isModify.value
}
// 清空绘制图层
function clearDrawLayer() {
  sourceDraw.clear()
}
// 选择框改变事件
function selectChange() {
  map.removeInteraction(draw)
  map.removeInteraction(snap)
  addInteractions()
}
// 捕捉功能开关函数
const snapSwitch = () => {
  if (toolForm.isSnap) {
    snap = new Snap({ source: sourceDraw })
    map.addInteraction(snap)
  } else {
    map.removeInteraction(snap)
  }
}
// 抽屉开关
function openDrawe() {
  isShowDrawer.value = true
  const featuresDraw = sourceDraw.getFeatures()
  const geoJsonDraw = new GeoJSON().writeFeatures(featuresDraw, {
    decimals: toolForm.decimalCoor
  })
  const wktDraw = new WKT().writeFeatures(featuresDraw, {
    decimals: toolForm.decimalCoor
  })
  const esriJsonDraw = new EsriJSON().writeFeatures(featuresDraw, {
    decimals: toolForm.decimalCoor
  })
  const kmlDraw = new KML().writeFeatures(featuresDraw, {
    decimals: toolForm.decimalCoor
  })
  geojsonDrawTextarea.value = geoJsonDraw
  wktDrawTextarea.value = wktDraw
  coorArrayTextarea.value = huanyu.wkt2CoorArrayStr(wktDrawTextarea.value) || ''
  esrijsonDrawTextarea.value = esriJsonDraw
  kmlDrawTextarea.value = kmlDraw
}
function closeDrawer() {
  isShowDrawer.value = false
}
// 下载数据
/* function downloadFile() {
  var file = new File([geojsonDrawTextarea.value], 'GeoJsonDraw.geojson', { type: 'text/plain;charset=utf-8' })
  saveAs(file)
} */
/**
 * 复制空间数据
 */
const copyGeometryData = () => {
  let text = ''
  if (activeNameCollapse.value == '1') {
    text = geojsonDrawTextarea.value
  } else if (activeNameCollapse.value == '2') {
    text = wktDrawTextarea.value
  } else if (activeNameCollapse.value == '3') {
    text = coorArrayTextarea.value
  } else if (activeNameCollapse.value == '4') {
    text = esrijsonDrawTextarea.value
  } else if (activeNameCollapse.value == '5') {
    text = kmlDrawTextarea.value
  }
  navigator.clipboard
    .writeText(text)
    .then(() => {
      ElMessage.success('数据已复制到剪贴板')
    })
    .catch((err) => {
      ElMessage.error('复制失败')
    })
}
</script>
<style scoped>
#map {
  width: 100%;
  height: 100%;
}

.box-card {
  position: absolute;
  left: 50px;
  top: 20px;
  max-width: 300px;
}
.el-button {
  margin: 0 10px;
}

.el-switch {
  margin: 0 3px 0 10px;
}
</style>
