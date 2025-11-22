<template>
  <div class="left-panel">
    <div class="panel-header">
      <h3>Folder Structure</h3>
      <!-- <button @click="refreshTree" :disabled="isLoading" class="refresh-btn">
        <span v-if="isLoading">⟳</span>
        <span v-else>🔄</span>
        Refresh
      </button> -->
    </div>
    
    <div class="tree-container">
      <div v-if="isLoading && treeStore.state.rootIds.length === 0" class="loading-state">
        <span>Loading folder structure...</span>
      </div>
      
      <div v-else-if="treeStore.state.rootIds.length === 0" class="empty-state">
        <span>No folders found</span>
      </div>
      
      <div v-else class="tree-content">

        <TreeNode
          v-for="rootId in treeStore.state.rootIds"
          :key="rootId"
          :nodeId="rootId"
          :level="0"
          @node-click="handleNodeClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTreeStore } from '../stores/tree.store';
import { useFolderService } from '../services/folder.service';
import type { TreeNode as TreeNodeType } from '../types/tree.types';
import TreeNode from './TreeNode.vue';

interface Emits {
  (e: 'folder-selected', folderId: string): void;
}

interface FolderItem extends TreeNodeType {
  size?: number;
}

const emit = defineEmits<Emits>();

const treeStore = useTreeStore();
const folderService = useFolderService();
const isLoading = ref(false);
const folderContents = ref<FolderItem[]>([]);

const loadFolderStructure = async () => {
  try {
    isLoading.value = true;
    const folders = await folderService.getAllFolders();
    treeStore.setNodes(folders);
  } catch (error) {
    console.error('Error loading folder structure:', error);
  } finally {
    isLoading.value = false;
  }
};

const refreshTree = async () => {
  await loadFolderStructure();
};

const handleNodeClick = (nodeId: string) => {
  const node = treeStore.findNode(nodeId);
  if (node && node.isFolder) {
    emit('folder-selected', nodeId);
  }
};

onMounted(() => {
  loadFolderStructure();
});
</script>

<style scoped>
.left-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  border-right: 1px solid #e0e0e0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  height: 54px;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #f0f0f0;
  border-color: #bbb;
}

.refresh-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #666;
  font-style: italic;
}

.tree-content {
  min-height: 100%;
}
</style>