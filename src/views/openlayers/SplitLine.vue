<template>
  <el-watermark
    id="watermark-container"
    :content="['https://chatgis.space', '@ChatGIS']"
  >
    <div id="map-container"></div>
    <SideNav />
    <FooterInfo />
    <!-- 右上角浮框 -->
    <div class="split-panel">
      <el-card shadow="always">
        <el-form>
          <!-- 线数据输入 -->
          <el-form-item label="线数据">
            <el-input
              v-model="wktLine"
              placeholder="输入WKT格式线数据，如: LINESTRING(116.3 39.9, 116.4 39.95)"
              type="textarea"
              :row="5"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadLineFromWkt">加载</el-button>
            <el-button @click="clearLine">清除</el-button>
          </el-form-item>
          <!-- 分割点输入 -->
          <el-form-item label="预分割点">
            <el-input
              v-model="pointInput"
              placeholder="输入坐标或点击地图选择点"
              class="input-coordinate"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="calculateSplitPoint"
              >计算分割点</el-button
            >
          </el-form-item>
          <!-- 最近点输出 -->
          <el-form-item label="分割点">
            <div class="input-group">
              <el-input
                v-model="pointSplit"
                placeholder="分割点坐标"
                class="input-coordinate"
                readonly
              />
              <el-button
                @click="copyContent(pointSplit)"
                :disabled="!pointSplit"
              >
                复制
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="splitLine" :disabled="!pointSplit"
              >分割线段</el-button
            >
          </el-form-item>
          <el-form-item label="分割结果">
            <div class="split-result">
              <div v-if="splitResults.length > 0" class="split-wkt-container">
                <div
                  v-for="(result, index) in splitResults"
                  :key="index"
                  class="split-wkt-item"
                >
                  <div class="split-wkt-label">线段 {{ index + 1 }}:</div>
                  <div class="split-wkt-content">
                    <el-input
                      v-model="splitResults[index]"
                      readonly
                      type="textarea"
                      :rows="5"
                    />
                    <el-button
                      @click="copyContent(splitResults[index])"
                      size="small"
                    >
                      复制
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-watermark>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { ImageTile as ImageTileSource, Vector as VectorSource } from 'ol/source'
import { Style, Stroke, Circle, Fill } from 'ol/style'
import { WKT } from 'ol/format'
import { Point, LineString } from 'ol/geom'
import Feature from 'ol/Feature'
import { ElMessage } from 'element-plus'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'
import * as turf from '@turf/turf'

const wktLine = ref(
  'LINESTRING(116.99903 36.677847,116.983409 36.639138,117.031131 36.619482,117.043233 36.632443)'
)
const pointInput = ref('')
const pointSplit = ref('')
const splitResults = ref([])
const mapParams = reactive({
  center: [117.01533, 36.661184],
  zoom: 12
})

// 地图和图层
let map = null
let vectorSource = null
let lineFeature = null
let splitPointFeature = null
let nearestPointFeature = null
let firstLineShow = null
let secondLineShow = null

// 初始化地图
onMounted(() => {
  const baseLayer = new TileLayer({
    source: new ImageTileSource({
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
  })
  vectorSource = new VectorSource()
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: (feature) => getStyle(feature)
  })
  map = new Map({
    target: 'map-container',
    layers: [baseLayer, vectorLayer],
    view: new View({
      center: mapParams.center,
      zoom: mapParams.zoom,
      projection: 'EPSG:4326'
    })
  })
  map.on('click', function (evt) {
    const coordinate = evt.coordinate
    pointInput.value = coordinate.join(', ')
    addSplitPoint(coordinate)
    calculateSplitPoint()
  })
})

const getStyle = (feature) => {
  const geometry = feature.getGeometry()
  if (geometry instanceof Point) {
    // 根据点的类型设置不同样式
    if (feature === splitPointFeature) {
      return new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: 'rgba(255, 0, 0, 0.8)' }),
          stroke: new Stroke({ color: '#ff0000', width: 2 })
        })
      })
    } else if (feature === nearestPointFeature) {
      return new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: 'rgba(0, 255, 0, 0.8)' }),
          stroke: new Stroke({ color: '#00ff00', width: 2 })
        })
      })
    }
  } else if (feature === lineFeature) {
    return new Style({
      stroke: new Stroke({
        color: '#0099ff',
        width: 5
      })
    })
  } else if (feature === firstLineShow) {
    return new Style({
      stroke: new Stroke({
        color: '#8760DC',
        width: 5
      })
    })
  } else if (feature === secondLineShow) {
    return new Style({
      stroke: new Stroke({
        color: '#FF6666',
        width: 5
      })
    })
  }
}
// 从WKT加载线
const loadLineFromWkt = () => {
  const wktFormat1 = new WKT()
  lineFeature = wktFormat1.readFeature(wktLine.value)
  vectorSource.addFeature(lineFeature)
  // 缩放到线范围
  map.getView().fit(lineFeature.getGeometry(), {
    padding: [100, 100, 100, 100],
    maxZoom: 18
  })
  /* // try {
    if (!wktLine.value) {
      ElMessage.warning('请输入WKT格式的线数据')
      return
    }
    
    // 清除之前的线
    clearLine()
    
    // 预处理WKT字符串，确保格式正确
    let wktString = wktLine.value.trim()
    
    // 检查是否包含LINESTRING关键字，如果没有则添加
    if (!wktString.toUpperCase().startsWith('LINESTRING')) {
      // 如果只有坐标部分，添加LINESTRING前缀
      if (wktString.startsWith('(')) {
        wktString = 'LINESTRING' + wktString
      } else {
        wktString = 'LINESTRING(' + wktString
         + ')'
      }
    }
    
    // 处理可能缺少括号的情况
    if (!wktString.includes('(')) {
      const lineStringPart = wktString.toUpperCase().indexOf('LINESTRING')
      if (lineStringPart !== -1) {
        const prefix = wktString.substring(0, lineStringPart + 'LINESTRING'.length)
        const coords = wktString.substring(lineStringPart + 'LINESTRING'.length)
        wktString = prefix + '(' + coords + ')'
      }
    }
    
    console.log('处理后的WKT字符串:', wktString)
    
    // 解析WKT
    const wktFormat = new WKT()
    try {
      lineFeature = wktFormat.readFeature(wktString)
    } catch (parseError) {
      console.error('WKT解析错误:', parseError)
      
      // 尝试修复常见的WKT格式问题
      let fixedWkt = wktString
      
      // 1. 尝试修复坐标格式
      const coordsMatch = wktString.match(/\(([^)]+)\)/)
      if (coordsMatch && coordsMatch[1]) {
        let coords = coordsMatch[1]
        
        // 处理坐标分隔
        // 确保点之间用逗号分隔，坐标内部用空格
        // 先规范化所有空格
        coords = coords.replace(/\s+/g, ' ')
        
        // 确保每对坐标之间有逗号
        // 将类似 "116.99903 36.677847 116.983409 36.639138" 转换为 "116.99903 36.677847, 116.983409 36.639138"
        const coordPairs = []
        const numbers = coords.split(/[\s,]+/).filter(n => n.trim() !== '')
        
        for (let i = 0; i < numbers.length; i += 2) {
          if (i + 1 < numbers.length) {
            coordPairs.push(numbers[i] + ' ' + numbers[i + 1])
          }
        }
        
        const fixedCoords = coordPairs.join(', ')
        fixedWkt = `LINESTRING(${fixedCoords})`
        
        console.log('修复后的WKT:', fixedWkt)
        
        try {
          lineFeature = wktFormat.readFeature(fixedWkt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326'
          })
        } catch (fixError) {
          console.error('修复后仍然出错:', fixError)
          throw new Error(`无法解析WKT，请检查格式是否正确。原始错误: ${parseError.message}`)
        }
      } else {
        throw parseError
      }
    }
    
    // 检查是否为线要素
    const geom = lineFeature.getGeometry()
    if (!(geom instanceof LineString)) {
      ElMessage.error('输入的WKT不是有效的LineString类型')
      lineFeature = null
      return
    }
    
    // 添加到地图
    vectorSource.addFeature(lineFeature)
    
    
    ElMessage.success('线数据加载成功') */
  /*   } catch (error) {
    ElMessage.error('WKT格式错误: ' + error.message)
    console.error('WKT加载错误:', error)
  } */
}

// 添加分割点
const addSplitPoint = (coordinate) => {
  // 移除之前的点
  if (splitPointFeature) {
    vectorSource.removeFeature(splitPointFeature)
  }

  // 创建新点
  splitPointFeature = new Feature({
    geometry: new Point(coordinate)
  })

  // 添加到地图
  vectorSource.addFeature(splitPointFeature)
}

// 计算线上最近点
const calculateSplitPoint = () => {
  try {
    // 检查是否有线
    if (!lineFeature) {
      ElMessage.warning('请先加载线数据')
      return
    }

    // 检查是否有分割点
    if (!pointInput.value) {
      ElMessage.warning('请输入或点击地图选择分割点')
      return
    }

    // 解析分割点坐标
    let coords = pointInput.value.split(/[,\s]+/).map(Number)
    if (coords.length < 2 || coords.some(isNaN)) {
      ElMessage.error('分割点坐标格式无效')
      return
    }

    // 获取线的坐标
    const lineGeom = lineFeature.getGeometry()
    const lineCoords = lineGeom.getCoordinates()

    // 转换为turf格式
    const line = turf.lineString(lineCoords)
    const point = turf.point(coords)

    // 计算最近点
    const nearestPoint = turf.nearestPointOnLine(line, point)
    const nearestCoord = nearestPoint.geometry.coordinates

    // 更新最近点坐标
    pointSplit.value = nearestCoord.join(', ')

    // 在地图上显示最近点
    if (nearestPointFeature) {
      vectorSource.removeFeature(nearestPointFeature)
    }

    nearestPointFeature = new Feature({
      geometry: new Point(nearestCoord)
    })

    vectorSource.addFeature(nearestPointFeature)
    vectorSource.removeFeature(firstLineShow)
    vectorSource.removeFeature(secondLineShow)
    ElMessage.success('已计算线上最近点')
  } catch (error) {
    ElMessage.error('计算最近点失败: ' + error.message)
    console.error(error)
  }
}

// 分割线
const splitLine = () => {
  try {
    // 检查是否有线和最近点
    if (!lineFeature || !pointSplit.value) {
      ElMessage.warning('请先加载线数据并计算最近点')
      return
    }

    // 获取线的坐标
    const lineGeom = lineFeature.getGeometry()
    const lineCoords = lineGeom.getCoordinates()

    // 解析最近点坐标
    const nearestCoord = pointSplit.value.split(/[,\s]+/).map(Number)

    // 转换为turf格式
    const line = turf.lineString(lineCoords)
    const point = turf.point(nearestCoord)

    // 计算分割点在线上的位置
    const nearestPoint = turf.nearestPointOnLine(line, point)

    // 分割线
    const sliceDistance = nearestPoint.properties.location
    const lineLength = turf.length(line)

    // 创建两段线
    const firstLine = turf.lineSliceAlong(line, 0, sliceDistance)
    const secondLine = turf.lineSliceAlong(line, sliceDistance, lineLength)

    // 转换为WKT
    const wktFormat = new WKT()
    const firstLineFeature = new Feature({
      geometry: new LineString(firstLine.geometry.coordinates)
    })
    const secondLineFeature = new Feature({
      geometry: new LineString(secondLine.geometry.coordinates)
    })
    firstLineShow = firstLineFeature
    vectorSource.addFeature(firstLineShow)
    secondLineShow = secondLineFeature
    vectorSource.addFeature(secondLineShow)
    // 更新分割结果
    splitResults.value = [
      wktFormat.writeFeature(firstLineFeature),
      wktFormat.writeFeature(secondLineFeature)
    ]

    ElMessage.success('线分割成功')
  } catch (error) {
    ElMessage.error('分割线失败: ' + error.message)
    console.error(error)
  }
}

// 清除线
const clearLine = () => {
  if (lineFeature) {
    vectorSource.removeFeature(lineFeature)
    lineFeature = null
  }

  if (splitPointFeature) {
    vectorSource.removeFeature(splitPointFeature)
    splitPointFeature = null
  }

  if (nearestPointFeature) {
    vectorSource.removeFeature(nearestPointFeature)
    nearestPointFeature = null
  }

  wktLine.value = ''
  pointInput.value = ''
  pointSplit.value = ''
  splitResults.value = []
}

// 复制到剪贴板
const copyContent = (content) => {
  if (!content) return

  const text = Array.isArray(content) ? content.join(',') : content
  navigator.clipboard
    .writeText(text)
    .then(() => {
      ElMessage.success('已复制到剪贴板')
    })
    .catch((err) => {
      ElMessage.error('复制失败')
      console.error(err)
    })
}
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 100vh;
}

.split-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 600px;
}

.input-coordinate {
  flex: 1;
}

.split-result {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.split-wkt-container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.split-wkt-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  background-color: #f5f7fa;
}

.split-wkt-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.split-wkt-content {
  display: flex;
  gap: 5px;
  align-items: flex-start;
}

.split-wkt-content .el-input {
  flex: 1;
}

.sample-wkt-text {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
  word-break: break-all;
  display: inline-block;
  max-width: 300px;
}
</style>
