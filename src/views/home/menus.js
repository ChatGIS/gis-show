/**
 * @description: 菜单
 * @return {*}
 */
const getHomeImg = (url) => {
  return new URL(`../../assets/images/home/${url}`, import.meta.url).href
}
const menus = [{
  title: 'GIS数据类型',
  imgSrc: getHomeImg('gaode-online-tile.png'),
  path: '/data-type',
  desc: '绘制生成常用GIS数据类型',
  tags: ['WKT', 'GeoJSON', 'GML']
}, {
  title: '高德在线瓦片',
  imgSrc: getHomeImg('gaode-online-tile.png'),
  path: '/gaode-online-tile',
  desc: '展示各种类型的高德在线瓦片地图',
  tags: ['高德', '瓦片']
}]
export default menus