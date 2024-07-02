<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import ProgressSpinner from 'primevue/progressspinner';
import { store } from './store';
</script>

<template>
  <Navbar />
  <div v-if="!store.loading" class="content p-6">
    <RouterView class="overflow-hidden" />
  </div>
  <div v-else="!store.loading" class="content p-6">
    <h3>Syncing network...</h3>
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
      aria-label="Custom ProgressSpinner" />
  </div>
</template>

<style scoped></style>
