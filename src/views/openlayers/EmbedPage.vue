<template>
  <div>
    <h4>子页面 - 被父页面的iframe嵌入</h4>
    <p>接收到的父页面消息: {{ receivedData }}</p>
    <el-button type="success" @click="sendToParent"
      >向父项目发送消息并调用方法</el-button
    >
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const receivedData = ref('')

// 向父项目发送消息
const sendToParent = () => {
  const message = {
    type: 'ChildData',
    data: '你好, 我是子页面！'
  }
  window.parent.postMessage(message, window.location.origin)
  // }
}

/**
 * 监听父项目发送的消息
 * @param event
 */
const handleMessage = (event) => {
  if (event.origin === window.location.origin) {
    if (event.data.type === 'ParentData') {
      const now = new Date()
      const timeString = now.toLocaleString()
      receivedData.value = event.data.data + timeString
      alertMessage()
    }
  }
}
/**
 * 弹出信息
 */
const alertMessage = () => {
  ElMessage.primary(receivedData.value)
}
onMounted(() => {
  // 注册消息监听
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>
