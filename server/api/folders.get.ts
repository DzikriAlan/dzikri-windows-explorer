import { PrismaClient } from "@prisma/client";
import { PrismaFolderRepository } from "../repositories/folder.repository";
import { FolderServiceImpl } from "../services/folder.service";

const prisma = new PrismaClient();
const folderRepository = new PrismaFolderRepository(prisma);
const folderService = new FolderServiceImpl(folderRepository);

export default defineEventHandler(async (event) => {
  try {
    const folders = await folderService.getAllFolders();
    return folders;
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch folders'
    });
  }
});