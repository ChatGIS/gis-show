<template>
    <div id="home-container" :style="'background-image:url(' + imgBackground + ')'">
        <el-image style="width: 100px; height: 100px" :src="imgProjectIcon" fit="fill"/>
        <div class='title-container'>
            <span>GIS SHOW</span><span>（</span><span>{{menuNum}}</span><span>）</span>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import imgBackground from '@/assets/images/home/background.jpg'
import imgProjectIcon from '@/assets/images/home/project_icon.png'

let menuNum = ref(0)
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