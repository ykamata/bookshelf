<script setup lang="ts">
import type { Book } from '~/data/books';

defineProps<{ book: Book }>();

function colorFromString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += (`00${value.toString(16)}`).slice(-2);
  }
  return color;
}
</script>

<template>
  <div
    class="book-card"
    :style="{
      '--book-color': colorFromString(book.title),
      '--book-height': 'var(--book-height)',
      '--book-width': 'var(--book-width)',
    }"
  >
    <div class="book-cover">
      <div class="book-spine" />
      <div class="book-front">
        <img
          :src="book.cover"
          :alt="book.title"
          class="w-full h-full object-cover"
        >
      </div>
    </div>
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
  transform-style: preserve-3d;
  transform: rotateY(-20deg);
  transition: transform 0.3s;
  cursor: pointer;
  margin-bottom: 2rem;
}

.book-card:hover {
  transform: rotateY(0) scale(1.05);
}

.book-cover {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.book-spine {
  width: 20px;
  height: 100%;
  background-color: var(--book-color);
  position: absolute;
  left: 0;
  transform: rotateY(90deg) translateX(-10px);
  transform-origin: left;
}

.book-front {
  width: 100%;
  height: 100%;
  background-color: var(--book-color);
  position: absolute;
  left: 0;
  transform-origin: left;
  transform: translateZ(20px);
}

.book-info {
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover .book-info {
  opacity: 1;
}
</style>
