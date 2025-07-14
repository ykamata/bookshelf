<script setup lang="ts">
import type { Book } from '~/data/books';

defineProps<{ book: Book }>();
</script>

<template>
  <div class="book-card">
    <img
      :src="book.cover"
      :alt="book.title"
      class="w-full h-full object-cover"
    >
    <div class="book-info">
      <h3 class="text-sm font-bold">
        {{ book.title }}
      </h3>
      <p class="text-xs text-gray-600">
        {{ book.author }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  width: var(--book-width);
  height: var(--book-height);
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

.book-card:hover {
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

.book-info {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 200px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
  z-index: 20;
}

.book-card:hover .book-info {
  opacity: 1;
}
</style>
