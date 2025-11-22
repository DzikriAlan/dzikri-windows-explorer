<template>
  <div class="explorer-container">
    <WindowsExplorer />
  </div>
</template>

<script setup lang="ts">
import WindowsExplorer from '~/src/layouts/WindowsExplorer.vue';
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  background-color: #f0f0f0;
}

.explorer-container {
  height: 100vh;
  width: 100vw;
}
</style>