<template>
  <el-watermark
    id="watermark-container"
    :content="['https://chatgis.space', '@ChatGIS']"
  >
    <div id="map-container"></div>
    <SideNav />
    <FooterInfo />
  </el-watermark>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'ol/ol.css'
import { Map, View, Overlay } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { ImageTile as ImageTileSource } from 'ol/source'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'

let map = null
const labels = ref([]);
const mapParams = ref({
  coorDecimal: 6,
  center: [117.026138,36.669277],
  zoom: 16,
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

  // 添加示例标注点
  addVerticalLabel([117.023958, 36.674964], '大明湖');
  addVerticalLabel([117.016049, 36.661176], '趵突泉');
  addVerticalLabel([117.021177, 36.661520], '泉城广场');
})
/**
 * 添加纵向文字标注
 * @param {Array} lonLat - 经纬度 [经度, 纬度]
 * @param {String} text - 标注文字
 */
const addVerticalLabel = (lonLat, text) => {
  const labelElement = document.createElement('div');
  labelElement.className = 'vertical-label';
  labelElement.innerHTML = text.split('').join('<br>');
  const markerElement = document.createElement('div');
  markerElement.className = 'marker';
  labelElement.appendChild(markerElement);
  
  // 创建 Overlay
  const labelOverlay = new Overlay({
    element: labelElement,
    position: lonLat,
    positioning: 'bottom-center',
    stopEvent: false // 允许鼠标事件穿透到地图
  });
  map.addOverlay(labelOverlay);
  labels.value.push(labelOverlay);
};
/**
 * 移除所有标注
 */
const removeAllLabels = () => {
  labels.value.forEach(overlay => {
    map.removeOverlay(overlay);
  });
  labels.value = [];
};
</script>
<style scoped>
#map-container {
  width: 100%;
  height: 100%;
}
/* 纵向文字标注样式 */
:deep(.vertical-label) {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  line-height: 1.5;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  pointer-events: auto; /* 允许鼠标事件 */
}

/* 点标记样式 */
:deep(.marker) {
  width: 8px;
  height: 8px;
  background-color: #ff4d4f;
  border-radius: 50%;
  margin: 3px auto 0;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.3);
}
</style>
