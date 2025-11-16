<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

interface Preference {
  id: number;
  preferenceType: string;
  value: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const preferences = ref<Preference[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Form state
const newPreference = ref({
  preferenceType: 'genre' as 'genre' | 'publisher' | 'author' | 'keyword',
  value: '',
});

const preferenceTypes = [
  { value: 'genre', label: 'Genre' },
  { value: 'publisher', label: 'Publisher' },
  { value: 'author', label: 'Author' },
  { value: 'keyword', label: 'Keyword' },
];

// Fetch preferences
async function fetchPreferences() {
  try {
    loading.value = true;
    error.value = null;
    const data = await $fetch<Preference[]>('/api/preferences');
    preferences.value = data;
  } catch (e: any) {
    error.value = e.message || 'Failed to load preferences';
    console.error('Error fetching preferences:', e);
  } finally {
    loading.value = false;
  }
}

// Add preference
async function addPreference() {
  if (!newPreference.value.value.trim()) {
    return;
  }

  try {
    await $fetch('/api/preferences', {
      method: 'POST',
      body: newPreference.value,
    });

    // Reset form
    newPreference.value.value = '';

    // Refresh list
    await fetchPreferences();
  } catch (e: any) {
    error.value = e.message || 'Failed to add preference';
    console.error('Error adding preference:', e);
  }
}

// Delete preference
async function deletePreference(id: number) {
  if (!confirm('Are you sure you want to delete this preference?')) {
    return;
  }

  try {
    await $fetch(`/api/preferences/${id}`, {
      method: 'DELETE',
    });

    // Refresh list
    await fetchPreferences();
  } catch (e: any) {
    error.value = e.message || 'Failed to delete preference';
    console.error('Error deleting preference:', e);
  }
}

// Toggle active status
async function toggleActive(preference: Preference) {
  try {
    await $fetch(`/api/preferences/${preference.id}`, {
      method: 'PATCH',
      body: { isActive: !preference.isActive },
    });

    // Update local state
    preference.isActive = !preference.isActive;
  } catch (e: any) {
    error.value = e.message || 'Failed to update preference';
    console.error('Error updating preference:', e);
  }
}

// Group preferences by type
const groupedPreferences = computed(() => {
  const groups: Record<string, Preference[]> = {
    genre: [],
    publisher: [],
    author: [],
    keyword: [],
  };

  preferences.value.forEach((pref) => {
    const group = groups[pref.preferenceType];
    if (group) {
      group.push(pref);
    }
  });

  return groups;
});

// Load preferences on mount
onMounted(() => {
  fetchPreferences();
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">
      User Preferences
    </h1>

    <p class="text-gray-600 mb-8">
      Manage your interests to receive notifications about new book releases that match your preferences.
    </p>

    <!-- Add new preference -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">
        Add New Preference
      </h2>

      <form @submit.prevent="addPreference" class="flex gap-4">
        <select
          v-model="newPreference.preferenceType"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option v-for="type in preferenceTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>

        <input
          v-model="newPreference.value"
          type="text"
          placeholder="Enter value..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >

        <button
          type="submit"
          class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add
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
        Loading preferences...
      </p>
    </div>

    <!-- Preferences list -->
    <div v-else class="space-y-6">
      <div v-for="(items, type) in groupedPreferences" :key="type" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4 capitalize">
          {{ type }}
        </h3>

        <div v-if="items.length === 0" class="text-gray-500 italic">
          No {{ type }} preferences added yet
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="pref in items"
            :key="pref.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div class="flex items-center gap-3">
              <button
                @click="toggleActive(pref)"
                class="text-sm"
                :class="pref.isActive ? 'text-green-600' : 'text-gray-400'"
              >
                <span v-if="pref.isActive">✓ Active</span>
                <span v-else>○ Inactive</span>
              </button>
              <span class="font-medium" :class="{ 'text-gray-400': !pref.isActive }">
                {{ pref.value }}
              </span>
            </div>

            <button
              @click="deletePreference(pref.id)"
              class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
