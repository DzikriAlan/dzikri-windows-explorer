import { ref, computed } from 'vue';
import { useTreeStore } from '../stores/tree.store';
import { useFolderService } from '../services/folder.service';
import type { TreeNode } from '../types/tree.types';

export function useExplorer() {
  const treeStore = useTreeStore();
  const folderService = useFolderService();
  
  const selectedFolderId = ref<string | undefined>(undefined);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const selectedFolder = computed(() => {
    return selectedFolderId.value ? treeStore.findNode(selectedFolderId.value) : null;
  });

  const selectedNodes = computed(() => {
    return Array.from(treeStore.state.selected).map(id => treeStore.findNode(id)).filter(Boolean);
  });

  const loadFolderStructure = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const folders = await folderService.getAllFolders();
      treeStore.setNodes(folders);
    } catch (err: any) {
      error.value = err.message || 'Failed to load folder structure';
      console.error('Error loading folder structure:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const selectFolder = (folderId: string) => {
    selectedFolderId.value = folderId;
  };

  const expandFolder = async (folderId: string) => {
    const node = treeStore.findNode(folderId);
    if (!node || !node.isFolder) return;

    treeStore.toggleNodeExpand(folderId);

    if (treeStore.isNodeExpanded(folderId) && node.childrenIds.length === 0 && node.hasMoreChildren) {
      try {
        treeStore.state.loading.add(folderId);
        const children = await folderService.getFolderChildren(folderId);
        treeStore.setNodes(children, folderId);
      } catch (err) {
        console.error('Error loading folder children:', err);
      } finally {
        treeStore.state.loading.delete(folderId);
      }
    }
  };

  const createFolder = async (name: string, parentId?: string) => {
    try {
      error.value = null;
      const newFolder = await folderService.createFolder({ name, parentId });
      
      treeStore.setNodes([newFolder], parentId || null);
      
      return newFolder;
    } catch (err: any) {
      error.value = err.message || 'Failed to create folder';
      throw err;
    }
  };

  const updateFolder = async (folderId: string, name: string) => {
    try {
      error.value = null;
      const updatedFolder = await folderService.updateFolder(folderId, { name });
      
      treeStore.state.nodes[folderId] = updatedFolder;
      
      return updatedFolder;
    } catch (err: any) {
      error.value = err.message || 'Failed to update folder';
      throw err;
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      error.value = null;
      await folderService.deleteFolder(folderId);
      
      const node = treeStore.findNode(folderId);
      if (node && node.parentId) {
        const parent = treeStore.findNode(node.parentId);
        if (parent) {
          parent.childrenIds = parent.childrenIds.filter(id => id !== folderId);
        }
      } else {
        treeStore.state.rootIds = treeStore.state.rootIds.filter(id => id !== folderId);
      }
      
      delete treeStore.state.nodes[folderId];
      treeStore.state.expanded.delete(folderId);
      treeStore.state.selected.delete(folderId);
      treeStore.state.loading.delete(folderId);
      
      if (selectedFolderId.value === folderId) {
        selectedFolderId.value = undefined;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete folder';
      throw err;
    }
  };

  const clearSelection = () => {
    selectedFolderId.value = undefined;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    selectedFolderId,
    isLoading,
    error,
    
    selectedFolder,
    selectedNodes,
    
    loadFolderStructure,
    selectFolder,
    expandFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    clearSelection,
    clearError,
    
    treeStore,
  };
}