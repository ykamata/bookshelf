<script setup lang="ts">
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover: string;
}

defineProps<{ book: Book }>();
</script>

<template>
  <div class="flex flex-col items-center border rounded p-2 bg-white">
    <img
      :src="book.cover"
      :alt="book.title"
      class="w-full h-48 object-cover"
    >
    <div class="mt-2 text-center">
      <h3 class="text-sm font-bold">
        {{ book.title }}
      </h3>
      <p class="text-xs text-gray-600">
        {{ book.author }}
      </p>
    </div>
  </div>
</template>
