<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />
  <div class="content p-6">
    <RouterView class="overflow-hidden" />
  </div>
</template>

<style scoped></style>
