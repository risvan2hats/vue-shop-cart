import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'
import { useProductStore } from './stores/productStore'

import './styles/main.css'

// Load every file in src/locale/ (en.json -> "en", fr.json -> "fr")
const files = import.meta.glob('./locale/*.json', { eager: true, import: 'default' })

const messages: Record<string, Record<string, string>> = {}
for (const path in files) {
  const code = path.split('/').pop()!.replace('.json', '')
  messages[code] = files[path] as Record<string, string>
}

const app = createApp(App)
app.use(createPinia())

const productStore = useProductStore()

const i18n = createI18n({
    legacy: false,
    locale: productStore.locale,
    fallbackLocale: 'en',
    messages,
})

document.documentElement.lang = productStore.locale

app.use(i18n)
app.use(router)
app.mount('#app')