<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

interface Publisher {
  id: number;
  name: string;
  websiteUrl?: string;
  rssUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const publishers = ref<Publisher[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Form state
const newPublisher = ref({
  name: '',
  websiteUrl: '',
  rssUrl: '',
});

const editingPublisher = ref<Publisher | null>(null);

// Fetch publishers
async function fetchPublishers() {
  try {
    loading.value = true;
    error.value = null;
    const data = await $fetch<Publisher[]>('/api/publishers');
    publishers.value = data;
  } catch (e: any) {
    error.value = e.message || 'Failed to load publishers';
    console.error('Error fetching publishers:', e);
  } finally {
    loading.value = false;
  }
}

// Add publisher
async function addPublisher() {
  if (!newPublisher.value.name.trim()) {
    return;
  }

  try {
    await $fetch('/api/publishers', {
      method: 'POST',
      body: {
        name: newPublisher.value.name,
        websiteUrl: newPublisher.value.websiteUrl || undefined,
        rssUrl: newPublisher.value.rssUrl || undefined,
      },
    });

    // Reset form
    newPublisher.value = {
      name: '',
      websiteUrl: '',
      rssUrl: '',
    };

    // Refresh list
    await fetchPublishers();
  } catch (e: any) {
    error.value = e.message || 'Failed to add publisher';
    console.error('Error adding publisher:', e);
  }
}

// Toggle active status
async function toggleActive(publisher: Publisher) {
  try {
    await $fetch(`/api/publishers/${publisher.id}`, {
      method: 'PATCH',
      body: { isActive: !publisher.isActive },
    });

    // Update local state
    publisher.isActive = !publisher.isActive;
  } catch (e: any) {
    error.value = e.message || 'Failed to update publisher';
    console.error('Error updating publisher:', e);
  }
}

// Start editing
function startEdit(publisher: Publisher) {
  editingPublisher.value = { ...publisher };
}

// Cancel editing
function cancelEdit() {
  editingPublisher.value = null;
}

// Save edit
async function saveEdit() {
  if (!editingPublisher.value) return;

  try {
    await $fetch(`/api/publishers/${editingPublisher.value.id}`, {
      method: 'PATCH',
      body: {
        name: editingPublisher.value.name,
        websiteUrl: editingPublisher.value.websiteUrl || undefined,
        rssUrl: editingPublisher.value.rssUrl || undefined,
      },
    });

    // Refresh list
    await fetchPublishers();
    editingPublisher.value = null;
  } catch (e: any) {
    error.value = e.message || 'Failed to update publisher';
    console.error('Error updating publisher:', e);
  }
}

// Load publishers on mount
onMounted(() => {
  fetchPublishers();
});
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">
      Publishers
    </h1>

    <p class="text-gray-600 mb-8">
      Manage publishers to track their new releases via RSS feeds or website scraping
    </p>

    <!-- Add new publisher -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">
        Add New Publisher
      </h2>

      <form @submit.prevent="addPublisher" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Publisher Name *
          </label>
          <input
            v-model="newPublisher.name"
            type="text"
            placeholder="e.g., Kodansha, Shueisha, etc."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <input
            v-model="newPublisher.websiteUrl"
            type="url"
            placeholder="https://example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            RSS Feed URL
          </label>
          <input
            v-model="newPublisher.rssUrl"
            type="url"
            placeholder="https://example.com/rss"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
        </div>

        <button
          type="submit"
          class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Publisher
        </button>
      </form>
    </div>

    <!-- Error message -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      <p class="mt-2 text-gray-600">
        Loading publishers...
      </p>
    </div>

    <!-- Publishers list -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="publishers.length === 0" class="p-8 text-center text-gray-500">
        No publishers added yet
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Website
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RSS Feed
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="publisher in publishers" :key="publisher.id">
            <template v-if="editingPublisher?.id === publisher.id">
              <td colspan="5" class="px-6 py-4">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      v-model="editingPublisher.name"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                    <input
                      v-model="editingPublisher.websiteUrl"
                      type="url"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">RSS Feed URL</label>
                    <input
                      v-model="editingPublisher.rssUrl"
                      type="url"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="saveEdit"
                      class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEdit"
                      class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </td>
            </template>
            <template v-else>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="toggleActive(publisher)"
                  class="text-sm"
                  :class="publisher.isActive ? 'text-green-600' : 'text-gray-400'"
                >
                  {{ publisher.isActive ? '✓ Active' : '○ Inactive' }}
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-medium">
                {{ publisher.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a
                  v-if="publisher.websiteUrl"
                  :href="publisher.websiteUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Link
                </a>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a
                  v-if="publisher.rssUrl"
                  :href="publisher.rssUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Link
                </a>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="startEdit(publisher)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
