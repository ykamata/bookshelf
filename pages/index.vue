<script setup lang="ts">
import { ref, computed } from 'vue'

interface Book {
  id: number
  title: string
  author: string
  genre: string
}

const books = ref<Book[]>([
  { id: 1, title: '1984', author: 'George Orwell', genre: 'Dystopian' },
  { id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic' },
  { id: 3, title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian' },
  { id: 4, title: 'Moby Dick', author: 'Herman Melville', genre: 'Adventure' }
])

const searchQuery = ref('')
const selectedGenre = ref('')

const genres = computed(() => {
  const g = books.value.map((b) => b.genre)
  return Array.from(new Set(g))
})

const filteredBooks = computed(() => {
  return books.value.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesGenre = selectedGenre.value
      ? book.genre === selectedGenre.value
      : true
    return matchesSearch && matchesGenre
  })
})
</script>

<template>
  <div class="container">
    <h1>Books</h1>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        placeholder="Search by title or author"
        class="search-input"
      />
      <select v-model="selectedGenre" class="genre-select">
        <option value="">All genres</option>
        <option v-for="genre in genres" :key="genre" :value="genre">
          {{ genre }}
        </option>
      </select>
    </div>

    <table class="book-list">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Genre</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in filteredBooks" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.genre }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
}

.genre-select {
  padding: 0.5rem;
}

.book-list {
  width: 100%;
  border-collapse: collapse;
}

.book-list th,
.book-list td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}
</style>
