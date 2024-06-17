<script setup lang="ts">
import Dropdown from 'primevue/dropdown';
import Menubar from 'primevue/menubar';
import { ref } from "vue";
import { store } from '../store';

const items = ref([
    {
        label: 'Stats',
        route: '/',
    },
    {
        label: 'On-Demand',
        route: '/upgrade',

    },
    {
        label: 'Ordering',
        route: '/ondemand',
    }
]);

const accounts = ref(store.pjsAccounts);
</script>

<template>
    <Menubar :model="items">
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </router-link>
        </template>
        <template #end>
            <div class="card flex justify-center">
                <Dropdown v-model="store.selectedAccount" :options="accounts" optionLabel="name"
                    placeholder="Select account" class="w-full md:w-[14rem]" />
            </div>
        </template>
    </Menubar>
</template>