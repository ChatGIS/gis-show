<template>
    <div id="home-container" :style="'background-image:url(' + imgBackground + ')'">
        <el-image style="width: 100px; height: 100px" :src="imgProjectIcon" fit="fill"/>
        <div class='title-container'>
            <span>GIS SHOW</span><span>（</span><span>{{menuNum}}</span><span>）</span>
        </div>
        <div id="tag-container">
          <el-check-tag v-for="tag in tagOptions" :key="tag.name" :checked="tag.checked" type="primary" @change="handleChangeTag(tag.name)">
            {{ tag.name }} {{ tag.num }}
        </el-check-tag>
        </div>
        <el-scrollbar>
          <el-row :gutter="20" justify="center" v-for="(items, index) in menuRow" :key="index">
              <el-col v-for="(item) in items" :key="item" :span="4">
                  <el-card :body-style="{ padding: '0px' }" @click="toPage(item.path)" shadow="hover">
                      <img style="width:200px; height:100px" :src="item.imgSrc" class="image" />
                      <div class="info">
                          <span>{{ item.title }}</span>
                      </div>
                      <div class="desc">
                          <span>{{ item.desc }}</span>
                      </div>
                      <div>
                        <el-tag v-for="tag in item.tags" :key=tag type="info" size="small" round>{{tag}}</el-tag>
                      </div>
                  </el-card>
              </el-col>
          </el-row>
        </el-scrollbar>
        <side-nav/>
        <footer-info/>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import imgBackground from '@/assets/images/home/background.jpg'
import imgProjectIcon from '@/assets/images/home/project_icon.png'
import menus from './menus';
import SideNav from '@/components/SideNav.vue';
import FooterInfo from '@/components/FooterInfo.vue';

let menuNum = ref(0)
const tagOptions = ref([])
let menuRow = ref([])
const selectedTags = []
const router = useRouter()
onMounted(() => {
  initTags()
  initMenus()
})
/**
 * @description: 初始化标签
 * @return {*}
 */
 const initTags = () => {
  let tagCountMap = new Map()
  menus.forEach(module => {
    module.tags.forEach(tag => {
      if (tagCountMap.has(tag)) {
        tagCountMap.set(tag, {
          name: tag,
          num: tagCountMap.get(tag).num + 1
        })
      } else {
        tagCountMap.set(tag, { name: tag, num: 1 })
      }
    })
  })

  let resultArray = Array.from(tagCountMap.values())

  resultArray.forEach(item => {
    tagOptions.value.push({
      name: item.name,
      checked: false,
      num: item.num
    })
  })
}
/**
 * @description: 初始化菜单
 * @return {*}
 */
const initMenus = () => {
  const menuArr = []
  menus.forEach((item, index) => {
    const row = Math.floor(index / 4)
    if (!menuArr[row]) {
      menuArr[row] = []
    }
    menuArr[row].push(item)
  })
  menuRow.value = menuArr
  menuNum.value = menus.length
}
/**
 * @description: 处理标签选择
 * @param {*} val
 * @return {*}
 */
 const handleChangeTag = (val) => {
  // 选择标签
  tagOptions.value.filter(item => item.name === val).forEach(item => {
    item.checked = !item.checked
    if(item.checked) {
      selectedTags.push(item.name)
    }else {
      selectedTags.splice(selectedTags.indexOf(item.name), 1)
    }
  })
  
  // 没有选择标签，显示所有菜单
  if(selectedTags.length === 0) {
    initMenus()
    return
  }
  // 根据标签过滤菜单
  const menuFilter = []
  menus.forEach((item, index) => {
    const row = Math.floor(index / 4)
    if (!menuFilter[row]) {
      menuFilter[row] = []
    }
    let set = new Set(selectedTags)
    let hasEqualElement = item.tags.some((element) => {
      return set.has(element)
    })
    if(hasEqualElement) {
      menuFilter[row].push(item)
    }
  })
  menuRow.value = menuFilter
  // 统计菜单数量
  let count = 0
  for (let i = 0; i < menuFilter.length; i++) {
    count += menuFilter[i].length
  }
  menuNum.value = count
}
/**
 * @description: 跳转页面
 * @param {*} path
 * @return {*}
 */
 const toPage = (path) => {
  router.push(path)
}
</script>
<style scoped>
#home-container {
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
}
.title-container {
  margin: 15px 0;
}
.title-container span{
    color: #FFF;
    font-size: 27px;
    font-weight: 700;
}
.el-row {
    margin: 10px 100px;
}

img {
    margin: 10px 5px 0;
}

.info {
    margin: 5px;
    font-weight: bold;
}

.desc {
    font-size: smaller;
}

.el-card {
    cursor: pointer;
}
.el-check-tag {
  margin: 1px 3px;
}
.el-scrollbar {
    height: calc(100% - 85px);
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-tag {
  margin: 2px 2px;
}
/* 图片旋转 */
.el-image:hover {
    animation-play-state: paused;
}
.el-image {
    position: absolute;
    left: 20px;
    animation: rotate 10s linear infinite;
}
@keyframes rotate {
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(360deg);
    }
}
</style>