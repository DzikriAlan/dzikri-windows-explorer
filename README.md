
# 📁 Windows Explorer - Manajer File Vue 3

## ✨ Ringkasan

**Teknologi yang digunakan:**
- Frontend: Vue 3, Nuxt 3, Pinia, TypeScript, Composition API, SCSS
- Backend: Node.js, REST API, TypeScript, Prisma ORM, MySQL
- Manajemen State: Pinia
- Database: MySQL 8+, Prisma schema

**Instalasi:**
1. Clone repo & install dependencies:
  ```bash
  git clone <repository-url>
  cd dzikri-windows-explorer
  npm install
  # atau yarn/pnpm install
  ```
2. Konfigurasi database di `.env`:
  ```env
  DATABASE_URL="mysql://username:password@localhost:3306/explorer_db"
  ```
3. Setup database & seed data:
  ```bash
  npm run db:setup
  # atau jalankan: npx prisma migrate dev && npx prisma db seed
  ```
4. Jalankan server dev:
  ```bash
  npm run dev
  # akses di http://localhost:3000
  ```

**Kebersihan & Kejelasan Kode:**
- Struktur folder feature-based, pemisahan frontend/backend jelas
- TypeScript strict, tanpa `any`, interface/type jelas
- Komponen Vue pakai `<script setup>`, Composition API, auto-import
- Pola service & repository di backend
- State Pinia: flat, akses O(1), mudah di-debug
- Semua logic reusable, modular, dan mudah di-maintain
- Penamaan variabel/komponen konsisten (camelCase, PascalCase)
- Komentar & dokumentasi singkat di bagian penting

**Struktur Data yang Dipilih:**
- Tree node: `Record<string, TreeNode>` (dictionary/hashmap) untuk akses O(1)
- State UI: pakai `Set<string>` untuk expanded/selected/loading (lookup O(1))
- Data backend: Prisma model Folder/File, relasi parent-child

**Algoritma yang Dipakai:**
- Tree rendering: depth-first traversal (DFS) dengan level tracking
- Filtering/pencarian: pencocokan string case-insensitive di frontend
- API: query children pakai relasi Prisma, efisien untuk nested
- Update state: langsung pada dictionary/set, tanpa traversal ulang

**Best Practice yang Diimplementasikan:**
- TypeScript strict mode, tanpa `any`
- Separation of concerns: komponen, store, service, repository, types
- RESTful API, error handling konsisten
- Validasi input pakai Zod
- UI responsif, SCSS modular
- Git workflow: feature branch, commit message konvensional, PR checklist
- Semua konfigurasi environment di `.env`
- Dokumentasi lengkap di README

## 🎯 Ruang Lingkup Project

Project ini mengimplementasikan aplikasi web file explorer yang meniru fitur utama Windows Explorer:

### Fitur Utama
- **Dual Panel Interface**: Panel kiri menampilkan struktur folder (tree), panel kanan menampilkan isi folder
- **Folder Bersarang Tak Terbatas**: Mendukung level folder bertingkat tanpa batas
- **Navigasi Expand/Collapse**: Tree folder interaktif dengan fitur expand/collapse
- **Data Real-time**: Semua data di-load dari database MySQL via REST API
- **Tree Custom**: Implementasi tree dari nol, tanpa library eksternal
- **Desain Responsif**: UI bersih, mirip Windows

### Fitur Teknis
- **Feature-based Architecture**: Struktur frontend modular
- **Type Safety**: Semua pakai TypeScript
- **State Management**: Pinia store dengan struktur data optimal
- **Performa**: Akses node pakai dictionary (O(1))
- **Clean Architecture**: Backend pakai pola Service + Repository


## 🚀 Quick Start

### Prasyarat
- Node.js 18+ 
- MySQL 8.0+
- npm/yarn/pnpm

### Instalasi

1. **Clone repository**
  ```bash
  git clone <repository-url>
  cd dzikri-windows-explorer
  ```
2. **Install dependencies**
  ```bash
  npm install
  # atau
  yarn install
  # atau
  pnpm install
  ```
3. **Setup Database**
  ```bash
  # Buat file .env
  DATABASE_URL="mysql://username:password@localhost:3306/explorer_db"

  # Jalankan migrasi database
  npx prisma migrate dev --name init
  npx prisma generate
  ```
4. **Seed Database (Opsional)**
  ```bash
  # Buat struktur folder sample
  npx prisma db seed
  ```
5. **Jalankan Development Server**
  ```bash
  npm run dev
  # Backend: http://localhost:3000
  # Frontend: http://localhost:3000
  ```

## 🏗️ Project Architecture

### Frontend Architecture (Feature-based)

```
src/
├── features/
│   └── explorer/
│       ├── components/      # Vue components
│       │   ├── LeftPanel.vue
│       │   ├── RightPanel.vue
│       │   └── TreeNode.vue
│       ├── services/        # API services
│       │   └── folder.service.ts
│       ├── stores/          # Pinia stores
│       │   └── tree.store.ts
│       ├── hooks/           # Composition API hooks
│       │   ├── useExplorer.ts
│       │   └── useTreeRenderer.ts
│       └── types/           # TypeScript interfaces
│           └── tree.types.ts
├── layouts/
│   └── WindowsExplorer.vue
├── core/                    # Core utilities
└── shared/                  # Shared components
```

### Backend Architecture (Service + Repository)

```
server/
├── api/
│   └── folders/
│       ├── index.get.ts            # GET /api/folders
│       ├── [id].ts                 # GET/PUT/DELETE /api/folders/:id
│       └── [id]/
│           └── children.get.ts     # GET /api/folders/:id/children
├── repositories/
│   └── folder.repository.ts        # Data access layer
├── services/
│   └── folder.service.ts           # Business logic layer
└── utils/
    └── api.ts                      # API utilities
```
## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```
### Running Tests
```bash
# Unit tests
npm run test

# Component tests  
npm run test:components

# E2E tests
npm run test:e2e
```

### Database Management
```bash
# Reset database
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy

# View database
npx prisma studio
```

### Building for Production
```bash
# Build application
npm run build

# Start production server
npm run start
```

### Environment Variables
```env
# Database
DATABASE_URL="mysql://user:pass@localhost:3306/db_name"

# Server
PORT=3000
NODE_ENV=development

# Optional: File Storage
UPLOAD_PATH="/uploads"
MAX_FILE_SIZE=10485760
```

## 📝 License

MIT License - see LICENSE file for details.

## 🔗 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Siap, project ini sudah lengkap dan terstruktur.** ✅
