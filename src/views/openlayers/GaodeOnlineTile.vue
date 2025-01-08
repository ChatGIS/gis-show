
<template>
  <el-row id="map-row">
    <el-col :span="3">
      <div class="map-title">01标准版</div>
      <div id="map-container1" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">04大字版(注记抽稀)</div>
      <div id="map-container2" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">06大字版(注记未抽稀、无图标)</div>
      <div id="map-container3" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">02老版本（新地物缺失、地图泛红）</div>
      <div id="map-container4" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">05路网加注记</div>
      <div id="map-container5" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">03影像</div>
      <div id="map-container6" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">叠加版:03+05</div>
      <div id="map-container7" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">叠加版:03+05去注记</div>
      <div id="map-container8" class="map-container"></div>
    </el-col>
  </el-row>
  <el-row id="map-row">
    <el-col :span="3">
      <div class="map-title">07只显示地块</div>
      <div id="map-container21" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">08只显示路网</div>
      <div id="map-container22" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">09地块+路网（无注记）</div>
      <div id="map-container23" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">10只显示注记（大字抽稀版本）</div>
      <div id="map-container24" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">11地块+注记（大字抽稀版本）</div>
      <div id="map-container25" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">12路网+注记（大字抽稀版本）</div>
      <div id="map-container26" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">13地块+路网+注记（大字抽稀版本）</div>
      <div id="map-container27" class="map-container"></div>
    </el-col>
    <el-col :span="3">
      <div class="map-title">英文版</div>
      <div id="map-container28" class="map-container"></div>
    </el-col>
  </el-row>
  <SideNav/>
  <FooterInfo article="https://chatgis.space/post/0010/index.html"/>
</template>
<script setup>
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import { onMounted } from 'vue'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'

const mapObj = {
  center: [117.01533, 36.661184],
  zoom: 15
}

onMounted(() => {
  const view = new View({
    center: mapObj.center,
    zoom: mapObj.zoom,
    projection: 'EPSG:4326',
  })
  new Map({
    layers: [gaodeTileLayer1],
    target: 'map-container1',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer2],
    target: 'map-container2',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer3],
    target: 'map-container3',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer4],
    target: 'map-container4',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer5],
    target: 'map-container5',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer6],
    target: 'map-container6',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer7, gaodeTileLayer5],
    target: 'map-container7',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer8, gaodeTileLayer51],
    target: 'map-container8',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer21],
    target: 'map-container21',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer22],
    target: 'map-container22',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer23],
    target: 'map-container23',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer24],
    target: 'map-container24',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer25],
    target: 'map-container25',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer26],
    target: 'map-container26',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer27],
    target: 'map-container27',
    view: view
  })
  new Map({
    layers: [gaodeTileLayer28],
    target: 'map-container28',
    view: view
  })
})

// 高德瓦片
const gaodeTileLayer1 = new TileLayer({
  source: new XYZ({
    url: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
  })
})

const gaodeTileLayer2 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
  })
})
const gaodeTileLayer3 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=9&x={x}&y={y}&z={z}'
  })
})
const gaodeTileLayer4 = new TileLayer({
  source: new XYZ({
    url: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
  })
})
const gaodeTileLayer5 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}'
  })
})
const gaodeTileLayer51 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}&scl=2'
  })
})
const gaodeTileLayer6 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
  })
})
const gaodeTileLayer7 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
  })
})
const gaodeTileLayer8 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
  })
})
const gaodeTileLayer21 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&ltype=1'
  })
})
const gaodeTileLayer22 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&ltype=2'
  })
})
const gaodeTileLayer23 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&ltype=3'
  })
})
const gaodeTileLayer24 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&ltype=4'
  })
})
const gaodeTileLayer25 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&ltype=5'
  })
})
const gaodeTileLayer26 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&ltype=6'
  })
})
const gaodeTileLayer27 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&ltype=7'
  })
})
const gaodeTileLayer28 = new TileLayer({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=en&size=1&style=7&x={x}&y={y}&z={z}&ltype=7'
  })
})
</script>
<style scoped>
#map-row {
  height: 50%;
}
.map-container {
  width: 100%;
  height: 94%;
}
.map-title {
  height: 20px;
  background-color: black;
  color: white;
  border-color: white;
  border: 1px solid;
}
</style>