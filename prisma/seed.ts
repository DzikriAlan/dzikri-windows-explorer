import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  try {
    await prisma.file.deleteMany()
    console.log('📁 Files cleared')
  } catch (error) {
    console.log('⚠️  Files table does not exist, skipping...')
  }

  await prisma.folder.deleteMany()
  console.log('📂 Folders cleared')

  const documents = await prisma.folder.create({
    data: {
      name: 'Documents',
      parentId: null,
    },
  })

  const desktop = await prisma.folder.create({
    data: {
      name: 'Desktop',
      parentId: null,
    },
  })

  const downloads = await prisma.folder.create({
    data: {
      name: 'Downloads',
      parentId: null,
    },
  })

  console.log('📂 Root folders created')

  const work = await prisma.folder.create({
    data: {
      name: 'Work',
      parentId: documents.id,
    },
  })

  const personal = await prisma.folder.create({
    data: {
      name: 'Personal',
      parentId: documents.id,
    },
  })

  const projects = await prisma.folder.create({
    data: {
      name: 'Projects',
      parentId: documents.id,
    },
  })

  const screenshots = await prisma.folder.create({
    data: {
      name: 'Screenshots',
      parentId: desktop.id,
    },
  })

  const software = await prisma.folder.create({
    data: {
      name: 'Software',
      parentId: downloads.id,
    },
  })

  const media = await prisma.folder.create({
    data: {
      name: 'Media',
      parentId: downloads.id,
    },
  })

  console.log('📂 Subfolders created')

  try {
    await prisma.file.createMany({
      data: [
        {
          name: 'Installer.exe',
          folderId: downloads.id,
          size: 45000000,
          mimeType: 'application/x-msdownload'
        },
        {
          name: 'Archive.zip',
          folderId: downloads.id,
          size: 8000000,
          mimeType: 'application/zip'
        },
        {
          name: 'Music.mp3',
          folderId: downloads.id,
          size: 5000000,
          mimeType: 'audio/mpeg'
        },
        {
          name: 'Report.docx',
          folderId: work.id,
          size: 150000,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        },
        {
          name: 'Presentation.pptx',
          folderId: work.id,
          size: 2500000,
          mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        },
        {
          name: 'Photo.jpg',
          folderId: personal.id,
          size: 3200000,
          mimeType: 'image/jpeg'
        },
        {
          name: 'Notes.txt',
          folderId: personal.id,
          size: 12000,
          mimeType: 'text/plain'
        },
        {
          name: 'index.html',
          folderId: projects.id,
          size: 8500,
          mimeType: 'text/html'
        },
        {
          name: 'style.css',
          folderId: projects.id,
          size: 15000,
          mimeType: 'text/css'
        },
        {
          name: 'script.js',
          folderId: projects.id,
          size: 25000,
          mimeType: 'application/javascript'
        },
        {
          name: 'Screenshot1.png',
          folderId: screenshots.id,
          size: 1800000,
          mimeType: 'image/png'
        },
        {
          name: 'Screenshot2.png',
          folderId: screenshots.id,
          size: 2100000,
          mimeType: 'image/png'
        },
        {
          name: 'VSCode.dmg',
          folderId: software.id,
          size: 95000000,
          mimeType: 'application/x-apple-diskimage'
        },
        {
          name: 'Chrome.dmg',
          folderId: software.id,
          size: 180000000,
          mimeType: 'application/x-apple-diskimage'
        },
        {
          name: 'Video.mp4',
          folderId: media.id,
          size: 125000000,
          mimeType: 'video/mp4'
        },
        {
          name: 'Audio.mp3',
          folderId: media.id,
          size: 8500000,
          mimeType: 'audio/mpeg'
        }
      ]
    })

    console.log('📄 Files created')
  } catch (error) {
    console.log('⚠️  Could not create files (File model might not exist):', error.message)
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })