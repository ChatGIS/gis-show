<template>
  <div id="footer-container">
    <a v-if="props.article" :href="props.article" target="_blank">相关文章</a>
    <span>集思秀@V{{ pkg.version }}</span>
  </div>
</template>
<script setup>
import pkg from '../../package.json'

const props = defineProps({
  article: String
})
</script>
<style scoped>
#footer-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #909399;
}
#footer-container a {
  color: #4e81e7;
  margin-right: 20px;
  /* text-decoration: none; */
  font-weight: 900;
}
</style>
