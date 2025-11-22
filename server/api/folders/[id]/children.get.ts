import { PrismaClient } from "@prisma/client";
import { PrismaFolderRepository } from "../../../repositories/folder.repository";
import { FolderServiceImpl } from "../../../services/folder.service";

const prisma = new PrismaClient();
const folderRepository = new PrismaFolderRepository(prisma);
const folderService = new FolderServiceImpl(folderRepository);

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);
    const folderId = getRouterParam(event, 'id');
    
    if (!folderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Folder ID is required',
      });
    }

    if (method === 'GET') {
      return await folderService.getFolderChildren(folderId);
    }
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});