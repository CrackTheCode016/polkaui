<script setup lang="ts">
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import { ref } from "vue";

const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        label: 'Features',
        icon: 'pi pi-star'
    },
]);
</script>

<template>
    <Menubar :model="items" />
</template>