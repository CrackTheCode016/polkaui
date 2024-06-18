<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Suspense>
    <Navbar />
    <template #fallback>
      Light client loading...
    </template>
  </Suspense>
  <Suspense>
    <div class="content p-6">
      <RouterView class="overflow-hidden" />
    </div>
    <template #fallback>
      Light client loading...
    </template>
  </Suspense>
</template>

<style scoped></style>
