<template>
  <div class="right-panel">
    <div class="panel-header">
      <h3>{{ currentFolderName || 'Select a folder' }}</h3>
      <div class="view-controls">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search..."
        />
        <button 
          @click="viewMode = 'grid'" 
          :class="{ active: viewMode === 'grid' }"
          class="view-btn"
        >
          ⚏ Grid
        </button>
        <button 
          @click="viewMode = 'list'" 
          :class="{ active: viewMode === 'list' }"
          class="view-btn"
        >
          ☰ List
        </button>
      </div>
    </div>
    
    <div class="content-area">
      <div v-if="isLoading" class="loading-state">
        <span>Loading folder contents...</span>
      </div>
      
      <div v-else-if="!selectedFolderId" class="empty-state">
        <div class="empty-message">
          <span class="empty-icon">📁</span>
          <p>Select a folder from the left panel to view its contents</p>
        </div>
      </div>
      
      <div v-else-if="folderContents.length === 0" class="empty-state">
        <div class="empty-message">
          <span class="empty-icon">📂</span>
          <p>This folder is empty</p>
        </div>
      </div>
      
      <div v-else class="content-grid" :class="`view-${viewMode}`">
        <div
          v-for="item in filteredContents"
          :key="item.id"
          class="content-item"
          @click="handleItemClick(item)"
          @dblclick="handleItemDoubleClick(item)"
        >
          <div class="item-icon">
            {{ item.isFolder ? '📁' : '📄' }}
          </div>
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div v-if="viewMode === 'list'" class="item-details">
              <span class="item-type">{{ item.isFolder ? 'Folder' : 'File' }}</span>
              <span v-if="!item.isFolder" class="item-size">{{ formatFileSize(item.size) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useFolderService } from '../services/folder.service';
import { useTreeStore } from '../stores/tree.store';
import type { TreeNode } from '../types/tree.types';

interface Props {
  selectedFolderId?: string;
}

interface FolderItem extends TreeNode {
  size?: number;
}

const props = defineProps<Props>();

const folderService = useFolderService();
const treeStore = useTreeStore();

const isLoading = ref(false);
const viewMode = ref<'grid' | 'list'>('grid');
const folderContents = ref<FolderItem[]>([]);
const searchQuery = ref('');
const filteredContents = computed(() => {
  if (!searchQuery.value) return folderContents.value;
  const q = searchQuery.value.toLowerCase();
  return folderContents.value.filter(item => item.name.toLowerCase().includes(q));
});

const currentFolderName = computed(() => {
  if (!props.selectedFolderId) return null;
  const folder = treeStore.findNode(props.selectedFolderId);
  return folder?.name || null;
});

const loadFolderContents = async (folderId: string) => {
  try {
    isLoading.value = true;
    const contents = await folderService.getFolderChildren(folderId);
    folderContents.value = contents;
    searchQuery.value = '';
  } catch (error) {
    console.error('Error loading folder contents:', error);
    folderContents.value = [];
    searchQuery.value = '';
  } finally {
    isLoading.value = false;
  }
};

const handleItemClick = (item: FolderItem) => {
  if (item.isFolder) {
    loadFolderContents(item.id)
  }
};

const handleItemDoubleClick = (item: FolderItem) => {
  if (item.isFolder) {
    loadFolderContents(item.id)
  }
};

const formatFileSize = (size?: number): string => {
  if (!size) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let fileSize = size;
  
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }
  
  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
};

watch(
  () => props.selectedFolderId,
  (newFolderId) => {
    if (newFolderId) {
      loadFolderContents(newFolderId);
    } else {
      folderContents.value = [];
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.search-input {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 8px;
  min-width: 120px;
}
.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.view-controls {
  display: flex;
  gap: 4px;
}

.view-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: all 0.2s;
}

.view-btn:hover {
  background-color: #f0f0f0;
  border-color: #bbb;
}

.view-btn.active {
  background-color: #2196f3;
  border-color: #2196f3;
  color: #fff;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.empty-message {
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-message p {
  margin: 0;
  font-style: italic;
}

.content-grid {
  display: grid;
  gap: 12px;
}

.content-grid.view-grid {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.content-grid.view-list {
  grid-template-columns: 1fr;
}

.content-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fff;
}

.content-item:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.view-grid .content-item {
  flex-direction: column;
  text-align: center;
}

.view-list .content-item {
  flex-direction: row;
}

.item-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.view-list .item-icon {
  font-size: 20px;
  margin-bottom: 0;
  margin-right: 12px;
}

.item-info {
  flex: 1;
}

.view-list .item-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item-name {
  font-weight: 500;
  font-size: 14px;
  color: #333;
  word-break: break-word;
}

.item-details {
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}

.item-type,
.item-size {
  font-size: 12px;
}
</style>