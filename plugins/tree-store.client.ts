import { useTreeStore } from '~/src/features/explorer/stores/tree.store'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const treeStore = useTreeStore()
  }
})