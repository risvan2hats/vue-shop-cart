import { ref } from 'vue'

export type ToastType = 'success' | 'error'

export const toast = ref<{ message: string; type: ToastType }>({ message: '', type: 'error' })

let toastTimer: ReturnType<typeof setTimeout> | undefined

export function showToast(message: string, type: ToastType = 'error') {
  console.log(`[${type}] ${message}`)

  toast.value = { message, type }

  clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toast.value = { message: '', type }
  }, 5000)
}
