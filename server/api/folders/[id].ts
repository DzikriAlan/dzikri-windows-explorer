import { PrismaClient } from "@prisma/client";
import { PrismaFolderRepository } from "../../repositories/folder.repository";
import { FolderServiceImpl } from "../../services/folder.service";

let prisma: PrismaClient;
let folderRepository: PrismaFolderRepository;
let folderService: FolderServiceImpl;

if (!prisma) {
  prisma = new PrismaClient();
  folderRepository = new PrismaFolderRepository(prisma);
  folderService = new FolderServiceImpl(folderRepository);
}

export default defineEventHandler(async (event) => {
  const folderId = getRouterParam(event, 'id');
  
  if (!folderId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Folder ID is required'
    });
  }

  try {
    const children = await folderService.getFolderChildren(folderId);
    return children;
  } catch (error) {
    console.error('Error fetching folder children:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch folder children'
    });
  }
});