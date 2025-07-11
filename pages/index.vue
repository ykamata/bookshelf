<script setup lang="ts">
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover: string;
}

const books = ref<Book[]>([
  {
    id: 1,
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    cover: 'https://placehold.co/150x200?text=1984',
  },
  {
    id: 2,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    cover: 'https://placehold.co/150x200?text=Gatsby',
  },
  {
    id: 3,
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    cover: 'https://placehold.co/150x200?text=Brave',
  },
  {
    id: 4,
    title: 'Moby Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    cover: 'https://placehold.co/150x200?text=Moby',
  },
]);

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
  <div class="p-8">
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
</template>
