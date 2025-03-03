<template>
  <RouterView />
</template>
<script lang="js" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
