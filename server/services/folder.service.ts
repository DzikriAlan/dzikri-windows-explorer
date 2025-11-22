import type { FolderRepository } from "../repositories/folder.repository";

export interface TreeNodeResponse {
  id: string;
  parentId: string | null;
  name: string;
  isFolder: boolean;
  childrenIds: string[];
  hasMoreChildren?: boolean;
}

export interface FolderApiResponse {
  success: boolean;
  data: any[];
  message?: string;
}

export interface FolderService {
  getAllFolders(): Promise<TreeNodeResponse[]>;
  getFolderById(id: string): Promise<TreeNodeResponse | null>;
  getFolderChildren(id: string): Promise<TreeNodeResponse[]>;
  createFolder(data: { name: string; parentId?: string }): Promise<TreeNodeResponse>;
  updateFolder(id: string, data: { name: string }): Promise<TreeNodeResponse>;
  deleteFolder(id: string): Promise<void>;
}

export class FolderServiceImpl {
  constructor(private folderRepository: FolderRepository) {}

  async getAllFolders(): Promise<FolderApiResponse> {
    try {
      const folders = await this.folderRepository.findAll();
      return {
        success: true,
        data: folders.map(folder => this.mapToTreeNode(folder)),
        message: "Folders retrieved successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to get all folders");
    }
  } 

  async getFolderById(id: string): Promise<FolderApiResponse> {
    try {
      const folder = await this.folderRepository.findById(id);
      if (!folder) {
        throw new Error("Folder not found");
      }
      return {
        success: true,
        data: [this.mapToTreeNode(folder)],
        message: "Folder retrieved successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to get folder by id");
    }
  }

async getFolderChildren(parentId: string): Promise<FolderApiResponse> {
  try {
    const { folders, files } = await this.folderRepository.findChildren(parentId);
    return {
      success: true,
      data: [
        ...folders.map(folder => this.mapToTreeNode(folder)),
        ...files.map(file => this.mapToTreeNodeFile(file))
      ],
      message: "Folder children retrieved successfully",
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to get folder children");
  }
}

  async createFolder(data: { name: string; parentId?: string }): Promise<FolderApiResponse> {
    try {
      const folder = await this.folderRepository.create(data);
      return {
        success: true,
        data: [this.mapToTreeNode(folder)],
        message: "Folder created successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create folder");
    }
  }

  async updateFolder(id: string, data: { name: string }): Promise<FolderApiResponse> {
    try {
      const folder = await this.folderRepository.update(id, data);
      return {
        success: true,
        data: [this.mapToTreeNode(folder)],
        message: "Folder updated successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update folder");
    }
  }

  async deleteFolder(id: string): Promise<FolderApiResponse> {
    try {
      await this.folderRepository.delete(id);
      return {
        success: true,
        data: [],
        message: "Folder deleted successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete folder");
    }
  }

  private mapToTreeNode(folder: any): TreeNodeResponse {
    return {
      id: folder.id,
      parentId: folder.parentId,
      name: folder.name,
      isFolder: true,
      childrenIds: folder.children?.map((child: any) => child.id) || [],
      hasMoreChildren: folder.children?.length > 0,
    };
  }

  private mapToTreeNodeFile(file: any): TreeNodeResponse {
  return {
    id: file.id,
    parentId: file.folderId,
    name: file.name,
    isFolder: false,
    childrenIds: [],
    hasMoreChildren: false,
  };
}
}