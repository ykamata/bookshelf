<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

interface NewRelease {
  id: number;
  title: string;
  author: string;
  publisherId?: number;
  publisherName?: string;
  genre?: string;
  isbn?: string;
  publicationDate?: string;
  coverUrl?: string;
  price?: number;
  description?: string;
  sourceUrl: string;
  crawledAt: string;
  isNotified: boolean;
  createdAt: string;
  updatedAt: string;
}

const releases = ref<NewRelease[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Filters
const filters = ref({
  genre: '',
  author: '',
  publisher: '',
  isNotified: null as boolean | null,
});

// Fetch releases
async function fetchReleases() {
  try {
    loading.value = true;
    error.value = null;

    const query: Record<string, any> = {};
    if (filters.value.genre) query.genre = filters.value.genre;
    if (filters.value.author) query.author = filters.value.author;
    if (filters.value.publisher) query.publisher = filters.value.publisher;
    if (filters.value.isNotified !== null) query.isNotified = filters.value.isNotified;

    const data = await $fetch<NewRelease[]>('/api/new-releases', { query });
    releases.value = data;
  } catch (e: any) {
    error.value = e.message || 'Failed to load new releases';
    console.error('Error fetching releases:', e);
  } finally {
    loading.value = false;
  }
}

// Mark as notified
async function markAsNotified(release: NewRelease) {
  try {
    await $fetch(`/api/new-releases/${release.id}`, {
      method: 'PATCH',
      body: { isNotified: true },
    });

    // Update local state
    release.isNotified = true;
  } catch (e: any) {
    error.value = e.message || 'Failed to update release';
    console.error('Error updating release:', e);
  }
}

// Clear filters
function clearFilters() {
  filters.value = {
    genre: '',
    author: '',
    publisher: '',
    isNotified: null,
  };
  fetchReleases();
}

// Format price
function formatPrice(price?: number) {
  if (!price) return 'N/A';
  return `¥${price.toLocaleString()}`;
}

// Format date
function formatDate(date?: string) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('ja-JP');
}

// Load releases on mount
onMounted(() => {
  fetchReleases();
});

// Watch filters
watch(filters, () => {
  fetchReleases();
}, { deep: true });
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">
        New Releases
      </h1>

      <button
        @click="fetchReleases"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Refresh
      </button>
    </div>

    <p class="text-gray-600 mb-8">
      Browse new book releases that match your interests
    </p>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-lg font-semibold mb-4">
        Filters
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.genre"
          type="text"
          placeholder="Genre..."
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >

        <input
          v-model="filters.author"
          type="text"
          placeholder="Author..."
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >

        <input
          v-model="filters.publisher"
          type="text"
          placeholder="Publisher..."
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >

        <select
          v-model="filters.isNotified"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option :value="null">
            All (New & Seen)
          </option>
          <option :value="false">
            New Only
          </option>
          <option :value="true">
            Seen Only
          </option>
        </select>
      </div>

      <div class="mt-4">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      <p class="mt-2 text-gray-600">
        Loading releases...
      </p>
    </div>

    <!-- Empty state -->
    <div v-else-if="releases.length === 0" class="bg-white shadow rounded-lg p-12 text-center">
      <p class="text-gray-600 text-lg">
        No new releases found
      </p>
      <p class="text-gray-500 mt-2">
        Try adjusting your filters or run the crawler to fetch new releases
      </p>
      <NuxtLink
        to="/crawler"
        class="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Go to Crawler
      </NuxtLink>
    </div>

    <!-- Releases grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="release in releases"
        :key="release.id"
        class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        :class="{ 'opacity-60': release.isNotified }"
      >
        <div v-if="release.coverUrl" class="h-64 bg-gray-200">
          <img :src="release.coverUrl" :alt="release.title" class="w-full h-full object-cover">
        </div>
        <div v-else class="h-64 bg-gray-200 flex items-center justify-center">
          <span class="text-gray-400">No cover image</span>
        </div>

        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-semibold line-clamp-2">
              {{ release.title }}
            </h3>
            <span
              v-if="!release.isNotified"
              class="flex-shrink-0 ml-2 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded"
            >
              NEW
            </span>
          </div>

          <p class="text-gray-600 mb-2">
            by {{ release.author }}
          </p>

          <div class="space-y-1 text-sm text-gray-500 mb-4">
            <p v-if="release.publisherName">
              Publisher: {{ release.publisherName }}
            </p>
            <p v-if="release.genre">
              Genre: {{ release.genre }}
            </p>
            <p v-if="release.publicationDate">
              Release Date: {{ formatDate(release.publicationDate) }}
            </p>
            <p v-if="release.price">
              Price: {{ formatPrice(release.price) }}
            </p>
            <p v-if="release.isbn">
              ISBN: {{ release.isbn }}
            </p>
          </div>

          <p v-if="release.description" class="text-sm text-gray-600 line-clamp-3 mb-4">
            {{ release.description }}
          </p>

          <div class="flex gap-2">
            <a
              :href="release.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 px-4 py-2 text-center bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              View Source
            </a>
            <button
              v-if="!release.isNotified"
              @click="markAsNotified(release)"
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Mark Seen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Release count -->
    <div class="mt-8 text-center text-gray-600">
      Showing {{ releases.length }} release{{ releases.length !== 1 ? 's' : '' }}
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
