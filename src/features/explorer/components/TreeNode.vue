<template>
  <div class="tree-node">
    <div 
      class="node-content"
      :class="{
        'node-selected': isSelected,
        'node-indeterminate': isIndeterminate
      }"
      @click="handleNodeClick"
    >
      <button
        v-if="node.isFolder && node.childrenIds.length > 0"
        class="expand-btn"
        @click.stop="handleToggleExpand"
        :disabled="isLoading"
      >
        <span v-if="isLoading">⟳</span>
        <span v-else-if="isExpanded">▼</span>
        <span v-else>▶</span>
      </button>
      <span v-else class="expand-spacer"></span>
      
      <input
        type="checkbox"
        class="node-checkbox"
        :checked="isSelected"
        :indeterminate="isIndeterminate"
        @change="handleToggleSelect"
        @click.stop
      />
      
      <span class="node-icon">
        {{ node.isFolder ? '📁' : '📄' }}
      </span>
      
      <span class="node-name">{{ node.name }}</span>
    </div>
    
    <div v-if="isExpanded && node.childrenIds.length > 0" class="node-children">
      <TreeNode
        v-for="childId in node.childrenIds"
        :key="childId"
        :nodeId="childId"
        :level="level + 1"
        @node-click="$emit('node-click', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTreeStore } from '../stores/tree.store';
import type { TreeNode } from '../types/tree.types';

interface Props {
  nodeId: string;
  level?: number;
}

interface Emits {
  (e: 'node-click', nodeId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
});

const emit = defineEmits<Emits>();

const treeStore = useTreeStore();

const node = computed<TreeNode>(() => treeStore.findNode(props.nodeId));
const isExpanded = computed(() => treeStore.isNodeExpanded(props.nodeId));
const isSelected = computed(() => treeStore.isNodeSelected(props.nodeId));
const isIndeterminate = computed(() => treeStore.isNodeIndeterminate(props.nodeId));
const isLoading = computed(() => treeStore.state.loading.has(props.nodeId));

const handleNodeClick = () => {
  emit('node-click', props.nodeId);
};

const handleToggleExpand = () => {
  treeStore.toggleNodeExpand(props.nodeId);
};

const handleToggleSelect = () => {
  treeStore.toggleNodeSelect(props.nodeId);
};
</script>

<style scoped>
.tree-node {
  user-select: none;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.node-content:hover {
  background-color: #f0f0f0;
}

.node-selected {
  background-color: #e3f2fd;
}

.node-indeterminate {
  background-color: #fff3e0;
}

.expand-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  margin-right: 4px;
  font-size: 12px;
  color: #666;
}

.expand-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.expand-spacer {
  width: 18px;
  margin-right: 4px;
}

.node-checkbox {
  margin-right: 8px;
}

.node-icon {
  margin-right: 6px;
  font-size: 14px;
}

.node-name {
  flex: 1;
  font-size: 14px;
}

.node-children {
  margin-left: 20px;
}
</style>