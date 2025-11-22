import { PrismaClient } from "@prisma/client";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  children?: Folder[];
  parent?: Folder | null;
}

export type FolderWithRelations = Folder & {
  children?: FolderWithRelations[];
  parent?: FolderWithRelations | null;
  files?: Array<{
    id: string;
    name: string;
    size: number;
    mimeType: string | null;
    folderId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface FolderRepository {
  findAll(): Promise<FolderWithRelations[]>;
  findById(id: string): Promise<FolderWithRelations | null>;
  findChildren(parentId: string): Promise<{folders: FolderWithRelations[]; files: FolderWithRelations["files"];}>
  findRoots(): Promise<FolderWithRelations[]>;
  create(data: { name: string; parentId?: string }): Promise<FolderWithRelations>;
  update(id: string, data: { name: string }): Promise<FolderWithRelations>;
  delete(id: string): Promise<void>;
}

export class PrismaFolderRepository implements FolderRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<FolderWithRelations[]> {
    const folders = await this.prisma.folder.findMany({
      include: {
        children: {
          include: {
            children: true,
            files: true
          }
        },
        files: true
      }
    });
    return folders;
  }

  async findById(id: string): Promise<FolderWithRelations | null> {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: {
        children: {
          include: {
            children: true,
            files: true
          }
        },
        parent: true,
        files: true
      }
    });
    return folder;
  }

  async findChildren(parentId: string): Promise<{ folders: FolderWithRelations[]; files: FolderWithRelations['files'] }> {
    try {
      // Pastikan parent folder ada
      const parentExists = await this.prisma.folder.findUnique({
        where: { id: parentId }
      });

      if (!parentExists) {
        return { folders: [], files: [] };
      }

      // Ambil semua folder anak
      const folders = await this.prisma.folder.findMany({
        where: { parentId: parentId },
        include: {
          children: {
            include: {
              files: true
            }
          },
          files: true,
          parent: {
            select: {
              id: true,
              name: true,
              parentId: true,
              createdAt: true,
              updatedAt: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      // Ambil semua file yang folderId-nya = parentId
      const files = await this.prisma.file.findMany({
        where: { folderId: parentId },
        orderBy: {
          name: 'asc'
        }
      });

      return { folders, files };
    } catch (error) {
      console.error(`❌ Error finding children for parentId ${parentId}:`, error);
      throw error;
    }
  }

  async findRoots(): Promise<FolderWithRelations[]> {
    const roots = await this.prisma.folder.findMany({
      where: { 
        parentId: null 
      },
      include: {
        children: {
          include: {
            children: true,
            files: true
          }
        },
        files: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    return roots;
  }

  async create(data: { name: string; parentId?: string }): Promise<FolderWithRelations> {
    const folder = await this.prisma.folder.create({
      data: {
        name: data.name,
        parentId: data.parentId || null
      },
      include: {
        children: true,
        files: true,
        parent: true
      }
    });
    return folder;
  }

  async update(id: string, data: { name: string }): Promise<FolderWithRelations> {
    const folder = await this.prisma.folder.update({
      where: { id },
      data: {
        name: data.name
      },
      include: {
        children: true,
        files: true,
        parent: true
      }
    });
    return folder;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.folder.deleteMany({
      where: { parentId: id }
    });
    
    await this.prisma.folder.delete({
      where: { id }
    });
  }
}