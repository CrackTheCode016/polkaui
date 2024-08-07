import { createApp } from 'vue'
import './style.css'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import 'primevue/resources/themes/aura-light-pink/theme.css'
import { createRouter, createMemoryHistory } from 'vue-router';
import ChainStats from './components/ChainStats.vue';
import Upgrade from './components/Upgrade.vue';
import OnDemand from './components/OnDemand.vue';
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';

const routes = [
    { path: '/', component: ChainStats },
    { path: '/upgrade', component: Upgrade },
    { path: '/ondemand', component: OnDemand }
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

createApp(App).use(PrimeVue).use(router).use(ToastService).mount('#app')