/**
 * @description: 菜单
 * @return {*}
 */
const getHomeImg = (url) => {
  return new URL(`../../assets/images/home/${url}`, import.meta.url).href
}
const menus = [{
  title: 'GIS数据类型',
  imgSrc: getHomeImg('data-type.png'),
  path: '/data-type',
  desc: '绘制生成常用GIS数据类型',
  tags: ['WKT', 'GeoJSON', 'GML']
}, {
  title: '三维相机参数',
  imgSrc: getHomeImg('camera-param.png'),
  path: 'https://chatgis.space/cesium-show/#/camera-param',
  desc: '基于Cesium的三维地形展示',
  tags: ['Cesium', '相机']
}, {
  title: '三维地形',
  imgSrc: getHomeImg('terrain_show.png'),
  path: 'https://chatgis.space/cesium-show/#/terrain-show',
  desc: '基于Cesium的三维地形展示',
  tags: ['Cesium', '地形']
}, {
  title: '圆形波纹扩散',
  imgSrc: getHomeImg('circle-wave.png'),
  path: 'https://chatgis.space/cesium-show/#/circle-wave',
  desc: 'Cesium自定义特效样式',
  tags: ['Cesium', '特效', '待开放']
}, {
  title: '高德在线瓦片',
  imgSrc: getHomeImg('gaode-online-tile.png'),
  path: '/gaode-online-tile',
  desc: '展示各种类型的高德在线瓦片地图',
  tags: ['高德', '瓦片']
}, {
  title: '自定义材质',
  imgSrc: getHomeImg('custom-material.png'),
  path: 'https://chatgis.space/cesium-show/#/custom-material',
  desc: 'Cesium自定义材质示例',
  tags: ['Cesium', '材质', 'QuickStart']
}, {
  title: 'MapLibre快速开始',
  imgSrc: getHomeImg('ml-quick-start.png'),
  path: '/ml-quick-start',
  desc: 'MapLibre最简示例，用于快速了解学习',
  tags: ['QuickStart']
}]
export default menus