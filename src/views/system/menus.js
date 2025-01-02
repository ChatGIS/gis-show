import getAssetsFile from '@/utils/sys-use'

/**
 * @description: 菜单
 * @return {*}
 */
const menus = [{
  title: '高德在线瓦片',
  imgSrc: getAssetsFile('menu/gaode-online-tile.png'),
  showRoute: '/gaode-online-tile',
  desc: '展示各种类型的高德在线瓦片地图',
  tags: ['高德', '瓦片']
}/*,{
  title: 'GIS数据类型',
  imgSrc: getAssetsFile('menu/default.png'),
  showRoute: '/data-type',
  desc: '通过在地图绘制生成各类GIS数据类型，提供编辑、下载功能',
  tags: ['WKT', 'GeoJSON', 'GML', 'EsriJson']
}, {
    title: '基础地图',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/map-base',
    desc: '基础高德地图展示，包括放大、缩小、定位等功能'
  }, {
    title: '行政区划',
    imgSrc: getAssetsFile('menu/area_show.png'),
    showRoute: '/area-show',
    desc: '行政区划数据：省、市、区县'
  }, {
    title: '弹框展示',
    imgSrc: getAssetsFile('menu/popup_show.png'),
    showRoute: '/popup-show',
    desc: '弹框展示多个要素列表'
  }, {
    title: 'GeoServer请求',
    imgSrc: getAssetsFile('menu/popup_show.png'),
    showRoute: '/geoServer-request',
    desc: 'GeoServer请求'
  },{
    title: '坐标转换',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/coor-convert',
    desc: '坐标转换(new)：线要素.geojson'
  },{
    title: '空间分析',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/spatial-analysis',
    desc: '面是否自相交'
  }, {
    title: '地图纠偏',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/map-rectification',
    desc: '纠偏高德底图；进行坐标转换'
  }, {
    title: '测量工具',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/measure-tool',
    desc: '长度测量、面积测量'
  }, {
    title: '地理编码',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/geo-code',
    desc: '地理编码、逆地理编码'
  }, {
    title: '要素样式',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/feature-style',
    desc: '点线面基础样式'
  }, {
    title: '水波样式',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/style-ripple',
    desc: '水波告警样式'
  }, {
    title: '双屏联动',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/dual-screen-linkage',
    desc: '双屏联动效果'
  }, {
    title: '地图卷帘',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/map-swipe',
    desc: '基于canvas实现地图卷帘效果'
  }, {
    title: '地图卷帘(上下)',
    imgSrc: getAssetsFile('menu/swipe_vertical.png'),
    showRoute: '/swipe-vertical',
    desc: '上下地图对比地铁建设情况'
  }, {
    title: '底图换色',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/map-color',
    desc: '切换底图瓦片颜色，快速呈现深蓝色、灰黑色等地图'
  }, {
    title: '在线地图',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/map-online',
    desc: '常用在线地图'
  }, {
    title: '图片配准',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/static-image',
    desc: '图片配准'
  }, {
    title: '捕捉追踪',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/draw-trace',
    desc: '捕捉要素，追踪已有要素，快速绘制'
  }, {
    title: 'HelloLeaflet',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/hello-leaflet',
    desc: '基于Leaflet的地图呈现'
  }, {
    title: '飞机航线',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/antv-l7-flyline',
    desc: 'antV-L7飞机航线图'
  }, {
    title: 'HelloCanvas',
    imgSrc: getAssetsFile('menu/hello_canvas.png'),
    showRoute: '/hello-canvas',
    desc: 'Canvas基础'
  }, {
    title: '楼层选择控件',
    imgSrc: getAssetsFile('menu/floor_bar.png'),
    showRoute: '/indoor-map',
    desc: '楼层选择控件'
  }, {
    title: '计算中心点',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/calc-center',
    desc: '计算中心点'
  }, {
    title: '交通控制组件',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/comp-traffic',
    desc: '交通控制组件',
    tags: ['组件', '交通']
  }, {
    title: '图例组件',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/comp-legend',
    desc: '图例组件',
    tags: ['组件', '图例']
  }, {
    title: '数据过滤组件',
    imgSrc: getAssetsFile('menu/default.png'),
    showRoute: '/comp-data-filter',
    desc: '图例组件',
    tags: ['组件', '数据过滤']
  }, {
    title: '北斗网格位置码',
    imgSrc: getAssetsFile('menu/beidou-grid-location-code.png'),
    showRoute: '/beidou-grid-location-code',
    desc: '北斗网格位置码',
    tags: ['北斗', '网格码']
  } */]
export {
  menus
}