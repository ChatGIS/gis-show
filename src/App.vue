<template>
  <h1>Hello App!</h1>
  <p>
    <strong>Current route path:</strong> {{ route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/about">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
    <el-button type="primary">element plus</el-button>
  </main>
</template>
<script lang="js" setup>
import { useRoute } from 'vue-router';
// import { ElButton } from 'element-plus';

const route =  useRoute()
</script>