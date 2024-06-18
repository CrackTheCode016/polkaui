<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Suspense>
    <Navbar />
  </Suspense>
  <div class="content">
    <Suspense>
      <RouterView />
    </Suspense>
  </div>
</template>

<style scoped></style>
