/**
 * @description: 菜单
 * @return {*}
 */
const cesiumBaseURL = 'https://chatgis.space/cesium-show/#'
const getHomeImg = (url) => {
  return new URL(`../../assets/images/home/${url}`, import.meta.url).href
}
const menus = [
  {
    title: '坐标拾取和转换',
    imgSrc: getHomeImg('coor-pick-convert.png'),
    path: '/coor-pick-convert',
    desc: '坐标拾取与常见坐标转换',
    tags: ['OL', '坐标转换']
  },
  {
    title: 'GIS数据类型',
    imgSrc: getHomeImg('data-type.png'),
    path: '/data-type',
    desc: '绘制生成常用GIS数据类型',
    tags: ['WKT', 'GeoJSON', 'GML']
  },
  {
    title: '地图颜色',
    imgSrc: getHomeImg('map-color.png'),
    path: '/map-color',
    desc: '图层滤镜实现地图瓦片颜色',
    tags: ['OL', '大屏']
  },
  {
    title: '热力图',
    imgSrc: getHomeImg('heatmap.png'),
    path: '/heatmap',
    desc: '基于OpenLayers的热力图展示',
    tags: ['OL', '热力图']
  },
  {
    title: '三维相机参数',
    imgSrc: getHomeImg('camera-param.png'),
    path: cesiumBaseURL + '/camera-param',
    desc: '基于Cesium的三维地形展示',
    tags: ['Cesium', '相机']
  },
  {
    title: '三维地形',
    imgSrc: getHomeImg('terrain_show.png'),
    path: cesiumBaseURL + '/terrain-show',
    desc: '基于Cesium的三维地形展示',
    tags: ['Cesium', '地形']
  },
  {
    title: '圆形波纹扩散',
    imgSrc: getHomeImg('circle-wave.png'),
    path: cesiumBaseURL + '/circle-wave-demo',
    desc: 'Cesium自定义特效样式',
    tags: ['Cesium', '特效', 'demo']
  },
  {
    title: '动态尾迹线',
    imgSrc: getHomeImg('polyline-trail.png'),
    path: cesiumBaseURL + '/polyline-trail-demo',
    desc: 'Cesium自定义特效样式',
    tags: ['Cesium', '特效', 'demo']
  },
  {
    title: '六边形扩散',
    imgSrc: getHomeImg('hexagon-spread.png'),
    path: cesiumBaseURL + '/hexagon-spread-demo',
    desc: 'Cesium自定义特效样式',
    tags: ['Cesium', '特效', 'demo']
  },
  {
    title: '单圈扩散',
    imgSrc: getHomeImg('scanline.png'),
    path: cesiumBaseURL + '/scanline-demo',
    desc: '单圈扩散、边缘暂停效果',
    tags: ['Cesium', '特效', 'demo']
  },
  {
    title: '动态围栏',
    imgSrc: getHomeImg('dynamic-wall.png'),
    path: cesiumBaseURL + '/dynamic-wall-demo',
    desc: '动态围栏效果',
    tags: ['Cesium', '特效', 'demo']
  },
  {
    title: '3DTiles展示',
    imgSrc: getHomeImg('3dtileset-show.png'),
    path: cesiumBaseURL + '/3dtileset-show-demo',
    desc: '白膜数据呈现',
    tags: ['Cesium', '特效', 'demo']
  },
  {
    title: '高德在线瓦片',
    imgSrc: getHomeImg('gaode-online-tile.png'),
    path: '/gaode-online-tile',
    desc: '展示各种类型的高德在线瓦片地图',
    tags: ['高德', '瓦片']
  },
  {
    title: '页面嵌入',
    imgSrc: getHomeImg('embed-page.png'),
    path: '/embed-page-parent',
    desc: '使用postMessage实现跨域页面的数据通信',
    tags: ['postMessage']
  },
  {
    title: '自定义材质',
    imgSrc: getHomeImg('custom-material.png'),
    path: cesiumBaseURL + '/custom-material',
    desc: 'Cesium自定义材质示例',
    tags: ['Cesium', '材质', 'QuickStart']
  },
  {
    title: 'MapLibre快速开始',
    imgSrc: getHomeImg('ml-quick-start.png'),
    path: '/ml-quick-start',
    desc: 'MapLibre最简示例，用于快速了解学习',
    tags: ['QuickStart']
  }
]
export default menus
