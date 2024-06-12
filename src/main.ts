import { createApp } from 'vue'
import './style.css'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import 'primevue/resources/themes/aura-light-pink/theme.css'

createApp(App).use(PrimeVue).mount('#app')