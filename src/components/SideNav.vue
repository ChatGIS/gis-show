<template>
    <div id="mySidenav" class="sidenav">
        <div id="btn-main" @click="handleClick(1)">
            <span>功能主页</span><img src="@/assets/image/main.png"/>
        </div>
        <div id="btn-desc" @click="handleClick(2)">
            <span>系统官网</span><img src="@/assets/image/desc.png"/>
        </div>
        <div id="btn-github" @click="handleClick(3)">
            <span>GitHub</span><img src="@/assets/image/github.png"/>
        </div>
        <div id="btn-gzh" @click="handleClick(4)">
            <span>集思地图</span><img src="@/assets/image/gzh.png"/>
        </div>
        <div id="btn-author" @click="handleClick(5)">
            <span>关于作者</span><img src="@/assets/image/author.png"/>
        </div>
    </div>
</template>
<script setup>
const handleClick = (val) => {
  console.log(val, window.location.origin, 'gis-show-01-03 18:06:35测试打印内容m')
  if(val == 1) {
    window.location.href = window.location.origin + '/gis-show/#/'
  } else if (val == 2) {
    window.open('https://chatgis.space/gisshow/', '_blank')
  } else if (val == 3) {
    window.open('https://github.com/ChatGIS/gis-show', '_blank')
  } else if (val == 4) {
    window.open('https://chatgis.space/about/', '_blank')
  } else if (val == 5) {
    window.open('https://chatgis.space/about/', '_blank')
  }
}
</script>
<style scoped>
#mySidenav {
  position: absolute;
  top: 20%;
}
#mySidenav div {
  display: flex;
  position: absolute; /* 相对于浏览器窗口定位它们 */
  left: -100px; /* 将它们放在屏幕之外 */
  transition: 0.3s; /* 在悬停时添加过渡 */
  padding: 13px; /* 15px 内边距 */
  width: 120px; /* 设置特定宽度 */
  text-decoration: none; /* 删除下划线 */
  font-size: 20px; /* 增加字体大小 */
  font-weight: 600;
  color: #000; /* 白色文本颜色 */
  border-radius: 0 5px 5px 0; /* 右上角和右下角的圆角 */
  background-color: #FFF;
}
#mySidenav span {
  line-height: 30px;  
  flex-grow: 2;
  caret-color: transparent;
}
#mySidenav img {
  width: 30px;
  height: 30px;
}
#mySidenav div:hover {
  cursor: pointer;  
  left: 0; /* 鼠标悬停时，使元素按应有的方式显示 */
}

#btn-main {
  top: 20px;
}

#btn-desc  {
  top: 80px;
}

#btn-github  {
  top: 140px;
}

#btn-gzh   {
  top: 200px;
}
#btn-author   {
  top: 260px;
}
</style>