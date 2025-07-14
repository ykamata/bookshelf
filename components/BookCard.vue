<script setup lang="ts">
import type { Book } from '~/data/books';
import { onMounted, ref } from 'vue';

defineProps<{ book: Book }>();

const rotation = ref(0);

onMounted(() => {
  rotation.value = Math.random() * 4 - 2; // -2 to 2 degrees
});
</script>

<template>
  <div
    class="book-card"
    :style="{
      '--book-color': book.color || '#d2b48c',
      '--rotation': `${rotation}deg`,
    }"
  >
    <div class="book-cover">
      <img
        :src="book.cover"
        :alt="book.title"
        class="w-full h-full object-cover"
      >
      <div class="book-spine" />
      <div class="book-footer" />
    </div>
    <div class="book-info">
      <h3 class="text-sm font-bold text-white">
        {{ book.title }}
      </h3>
      <p class="text-xs text-gray-300">
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
  perspective: 1000px;
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
  cursor: pointer;
  z-index: 1;
  transform-style: preserve-3d;
  transform: rotateZ(var(--rotation));
}

.book-card:hover {
  transform: translateY(-10px) rotateY(-25deg);
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.book-cover {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  border-radius: 2px 4px 4px 2px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.book-card:hover .book-cover {
  transform: rotateY(-25deg);
}

.book-spine {
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 100%;
  background: color-mix(in srgb, var(--book-color) 80%, black);
  transform: rotateY(-90deg) translateX(-10px);
  transform-origin: left;
  border-radius: 2px 0 0 2px;
}

.book-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background: color-mix(in srgb, var(--book-color) 70%, black);
    transform: rotateX(90deg) translateY(5px);
    transform-origin: bottom;
}

.book-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  padding: 0.5rem;
  background: rgba(0,0,0,0.6);
  border-radius: 0.25rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s 0.2s, transform 0.3s 0.2s;
  z-index: 20;
}

.book-card:hover .book-info {
  opacity: 1;
  transform: translateY(0);
}
</style>
