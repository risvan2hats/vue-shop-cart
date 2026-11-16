import { ref } from 'vue';

export const errorToast = ref('');
let toastTimer;

export function useErrorMessage(error, fallback) {
    const message = error?.response?.data?.message || error?.message || fallback;

    console.log(`${message}`);

    errorToast.value = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        errorToast.value = '';
    }, 5000);

    return message;
}
