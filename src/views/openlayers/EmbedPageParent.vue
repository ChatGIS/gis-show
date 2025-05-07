<template>
  <el-watermark
    id="watermark-container"
    :content="['https://chatgis.space', '@ChatGIS']"
  >
    <div>
      <h3>父页面 - 通过iframe嵌入子页面</h3>
      <div>
        <el-button type="primary" @click="handleSetMapStatus"
          >传值给子页面并调用子页面方法</el-button
        >
        <br />
        <span>获取子页面消息：{{ messageChild }}</span>
      </div>
      <iframe
        ref="mapIframe"
        :src="mapURL"
        width="80%"
        height="600px"
        frameborder="1"
      ></iframe>
    </div>
  </el-watermark>
  <SideNav />
  <FooterInfo />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import SideNav from '@/components/SideNav.vue'
import FooterInfo from '@/components/FooterInfo.vue'

const messageChild = ref('')

// 子项目URL（需替换为实际地址）
const mapURL = window.location.origin + '/gis-show/#/embed-page'
const mapIframe = ref(null)

// 向子项目发送消息
const handleSetMapStatus = () => {
  if (mapIframe.value) {
    // 消息格式建议包含类型和数据
    const message = {
      type: 'ParentData',
      data: '你好，我是父页面！'
    }
    // targetOrigin设为子项目域名，确保安全性
    mapIframe.value.contentWindow.postMessage(message, window.location.origin)
  }
}
/**
 * 监听子项目返回的消息
 * @param event
 */
const handleMessage = (event) => {
  // 验证消息来源，避免恶意攻击
  if (event.origin === window.location.origin) {
    const iframeData = event.data
    if (iframeData.type === 'ChildData') {
      const now = new Date()
      const timeString = now.toLocaleString()
      messageChild.value = iframeData.data + timeString
      alertMessage()
    }
  }
}
/**
 * 弹出信息
 */
const alertMessage = () => {
  ElMessage.success(messageChild.value)
}
onMounted(() => {
  // 挂载时注册消息监听
  window.addEventListener('message', handleMessage)
  handleSetMapStatus()
})

onUnmounted(() => {
  // 卸载时移除监听，避免内存泄漏
  window.removeEventListener('message', handleMessage)
})
</script>
