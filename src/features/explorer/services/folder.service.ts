import type { TreeNode } from '../types/tree.types';

export interface FolderApiResponse {
  success: boolean;
  data: any[];
  message?: string;
}

export interface FolderService {
  getAllFolders(): Promise<TreeNode[]>;
  getFolderById(id: string): Promise<TreeNode | null>;
  getFolderChildren(folderId: string): Promise<TreeNode[]>;
  createFolder(data: { name: string; parentId?: string }): Promise<TreeNode>;
  updateFolder(id: string, data: { name: string }): Promise<TreeNode>;
  deleteFolder(id: string): Promise<void>;
}

class FolderServiceImpl implements FolderService {
  private baseUrl = '/api/folders';

  async getAllFolders(): Promise<TreeNode[]> {
    try {
      const response = await $fetch<FolderApiResponse>(this.baseUrl);

      if (response?.success && response?.data) {
        return response?.data?.map(folder => this.mapToTreeNode(folder)) ?? [];
      }

      return [];
    } catch (error) {
      console.error('Error fetching all folders:', error);
      throw new Error('Failed to fetch folders');
    }
  }

  async getFolderById(id: string): Promise<TreeNode | null> {
    try {
      const response = await $fetch<FolderApiResponse>(`${this.baseUrl}/${id}`);
      if (response?.success && response?.data) {
        return this.mapToTreeNode(response?.data);
      }
      return null;
    } catch (error) {
      console.error('Error fetching folder by ID:', error);
      return null;
    }
  }

  async getFolderChildren(folderId: string): Promise<TreeNode[]> {
    try {
      const response = await $fetch<FolderApiResponse>(`${this.baseUrl}/${folderId}/children`);
      if (response?.success && response?.data) {
        return response?.data?.map(folder => this.mapToTreeNode(folder));
      }
      return [];
    } catch (error) {
      console.error('Error fetching folder children:', error);
      return [];
    }
  }

  async createFolder(data: { name: string; parentId?: string }): Promise<TreeNode> {
    try {
      const response = await $fetch<FolderApiResponse>(this.baseUrl, {
        method: 'POST',
        body: data,
      });
      
      if (response?.success && response?.data) {
        return this.mapToTreeNode(response?.data);
      }
      throw new Error('Failed to create folder');
    } catch (error) {
      console.error('Error creating folder:', error);
      throw new Error('Failed to create folder');
    }
  }

  async updateFolder(id: string, data: { name: string }): Promise<TreeNode> {
    try {
      const response = await $fetch<FolderApiResponse>(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        body: data,
      });
      
      if (response?.success && response?.data) {
        return this.mapToTreeNode(response?.data);
      }
      throw new Error('Failed to update folder');
    } catch (error) {
      console.error('Error updating folder:', error);
      throw new Error('Failed to update folder');
    }
  }

  async deleteFolder(id: string): Promise<void> {
    try {
      await $fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw new Error('Failed to delete folder');
    }
  }

  private mapToTreeNode(node: any): TreeNode {
    return {
      id: node?.id,
      parentId: node?.parentId,
      name: node?.name,
      isFolder: node?.isFolder,
      childrenIds: node?.childrenIds ?? [],
      hasMoreChildren: node?.hasMoreChildren,
    };
  }
}

export function useFolderService(): FolderService {
  return new FolderServiceImpl();
}