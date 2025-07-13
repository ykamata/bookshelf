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
  <div class="min-h-screen bg-gray-100">
    <div class="p-8">
      <h1 class="text-3xl font-bold text-center mb-8">
        My Awesome Bookshelf
      </h1>

      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <input
          v-model="searchQuery"
          placeholder="Search by title or author"
          class="flex-1 p-2 border rounded"
        >
        <select
          v-model="selectedGenre"
          class="p-2 border rounded"
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
          class="p-2 border rounded"
        >
          <option value="title">
            Sort by Title
          </option>
          <option value="author">
            Sort by Author
          </option>
        </select>
      </div>

      <div class="bookshelf">
        <div
          v-for="book in sortedBooks"
          :key="book.id"
          class="book-container"
        >
          <BookCard :book="book" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookshelf {
  --shelf-height: 250px;
  --shelf-color: #d2b48c;
  --book-height: 200px;
  --book-width: 150px;

  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 2rem;
  gap: 4rem;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent calc(var(--shelf-height) - 2px),
      var(--shelf-color) 0,
      var(--shelf-color) var(--shelf-height)
    );
  min-height: calc(var(--shelf-height) * 3);
}

.book-container {
  perspective: 1000px;
}

@media (max-width: 768px) {
  .bookshelf {
    --shelf-height: 200px;
    --book-height: 150px;
    --book-width: 100px;
    justify-content: center;
  }
}
</style>
