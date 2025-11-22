export default defineNuxtConfig({
  compatibilityDate: '2024-11-20',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    databaseUrl: ''
  },
  nitro: {
    experimental: {
      wasm: true
    }
  },
  ssr: true,
  typescript: {
    typeCheck: false // Disable built-in type checking to avoid conflicts
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }
  }
})