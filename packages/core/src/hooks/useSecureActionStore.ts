import { ref } from 'vue'

export const useSecureActionStore = () => {
  const openPromise = ref<Promise<boolean>>()
  const openResolve = ref<(value: boolean | PromiseLike<boolean>) => void>()
  return { openPromise, openResolve }
}
