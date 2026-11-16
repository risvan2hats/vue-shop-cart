
import { ref } from 'vue'

export const toast = ref({ message: '', type: 'error' })

let toastTimer

export function showToast(message, type = 'error') {
    console.log(`[${type}] ${message}`)

    toast.value = { message, type }

    clearTimeout(toastTimer)

    toastTimer = setTimeout(() => {
        toast.value = { message: '', type }
    }, 5000)
}
