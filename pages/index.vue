<script setup lang="ts">
import type { Book } from '~/data/books';

// Fetch books from API
const { data: books, error } = await useFetch<Book[]>('/api/books');

// Fallback to empty array if fetch fails
if (error.value) {
  console.error('Failed to load books:', error.value);
}

const booksRef = ref<Book[]>(books.value || []);

const searchQuery = ref('');
const selectedGenre = ref('');
const sortKey = ref<'title' | 'author'>('title');

const genres = computed(() => {
  const g = booksRef.value.map(b => b.genre);
  return Array.from(new Set(g));
});

const filteredBooks = computed(() => {
  return booksRef.value.filter((book) => {
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
  --shelf-height: 300px;
  --shelf-color: #8B4513; /* SaddleBrown */
  --book-height: 220px;
  --book-width: 160px;
  --shelf-thickness: 20px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--book-width), 1fr));
  gap: 2.5rem;
  padding: 2rem 4rem;
  background-color: #deb887; /* BurlyWood */
  background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png');
  position: relative;
}

.bookshelf::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent calc(var(--shelf-height) - var(--shelf-thickness)),
      var(--shelf-color) 0,
      var(--shelf-color) var(--shelf-height)
    );
  box-shadow:
    inset 0 10px 10px -10px rgba(0,0,0,0.5),
    inset 0 -10px 10px -10px rgba(0,0,0,0.5);
  pointer-events: none;
}

.book-container {
  width: var(--book-width);
  height: var(--book-height);
  margin-bottom: calc(var(--shelf-height) - var(--book-height) + var(--shelf-thickness));
  align-self: end;
  justify-self: center;
}

@media (max-width: 768px) {
  .bookshelf {
    --shelf-height: 250px;
    --book-height: 180px;
    --book-width: 120px;
    padding: 1.5rem 2rem;
  }
}
</style>
