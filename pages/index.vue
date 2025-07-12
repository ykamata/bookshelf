<script setup lang="ts">
import type { Book } from '~/data/books';
import { sampleBooks } from '~/data/books';

const books = ref<Book[]>(sampleBooks);

const searchQuery = ref('');
const selectedGenre = ref('');
const sortKey = ref<'title' | 'author'>('title');

const genres = computed(() => {
  const g = books.value.map(b => b.genre);
  return Array.from(new Set(g));
});

const filteredBooks = computed(() => {
  return books.value.filter((book) => {
    const query = searchQuery.value.toLowerCase();
    const matchesSearch
      = book.title.toLowerCase().includes(query)
        || book.author.toLowerCase().includes(query);
    const matchesGenre = selectedGenre.value
      ? book.genre === selectedGenre.value
      : true;
    return matchesSearch && matchesGenre;
  });
});

const sortedBooks = computed(() => {
  return [...filteredBooks.value].sort((a, b) =>
    a[sortKey.value].localeCompare(b[sortKey.value]),
  );
});
</script>

<template>
  <div
    class="min-h-screen bg-cover bg-center"
    style="background-image: url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1350&q=80')"
  >
    <div class="p-8 min-h-screen bg-white/70 bookshelf">
      <h1>Bookshelf</h1>

      <div class="flex gap-4 mb-4">
        <input
          v-model="searchQuery"
          placeholder="Search by title or author"
          class="flex-1 p-2"
        >
        <select
          v-model="selectedGenre"
          class="p-2"
        >
          <option value="">
            All genres
          </option>
          <option
            v-for="genre in genres"
            :key="genre"
            :value="genre"
          >
            {{ genre }}
          </option>
        </select>
        <select
          v-model="sortKey"
          class="p-2"
        >
          <option value="title">
            Title
          </option>
          <option value="author">
            Author
          </option>
        </select>
      </div>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        <BookCard
          v-for="book in sortedBooks"
          :key="book.id"
          :book="book"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookshelf {
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 148px,
    #d2b48c 148px,
    #d2b48c 150px
  );
  background-size: 100% 150px;
}
</style>
