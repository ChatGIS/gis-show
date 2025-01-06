<template>
  <RouterView />
</template>
<script lang="js" setup>
import { useRoute } from 'vue-router';

const route =  useRoute()
</script>
<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
html,body {
  width: 100%;
  height: 100%;
  margin: 0;
} */
</style>