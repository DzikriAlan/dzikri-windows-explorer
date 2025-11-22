<template>
  <div class="windows-explorer">
    <header class="explorer-header">
      <h1>Windows Explorer</h1>
    </header>
    
    <main class="explorer-main">
      <div class="explorer-content">
        <div class="panels">
          <div class="panel left-panel">
            <LeftPanel @folder-selected="handleFolderSelected" />
          </div>
          
          <div class="panel right-panel">
            <RightPanel :selected-folder-id="selectedFolderId" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LeftPanel from '~/src/features/explorer/components/LeftPanel.vue'
import RightPanel from '~/src/features/explorer/components/RightPanel.vue'

const selectedFolderId = ref<string | undefined>(undefined)

const handleFolderSelected = (folderId: string) => {
  selectedFolderId.value = folderId
  console.log('Selected folder ID:', folderId)
}
</script>

<style scoped>
.windows-explorer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f0f0;
}

.explorer-header {
  background: #0078d4;
  color: white;
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;
}

.explorer-header h1 {
  margin: 0;
  font-size: 16px;
  font-weight: normal;
}

.explorer-main {
  flex: 1;
  overflow: hidden;
}

.explorer-content {
  height: 100%;
}

.panels {
  display: flex;
  height: 100%;
}

.panel {
  border-right: 1px solid #ddd;
}

.left-panel {
  width: 300px;
  min-width: 200px;
  background: white;
}

.right-panel {
  flex: 1;
  background: white;
}
</style>