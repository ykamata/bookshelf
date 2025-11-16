<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

interface CrawlerSchedule {
  id: number;
  name: string;
  description?: string;
  frequency: string;
  lastRunAt?: string;
  nextRunAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CrawlerLog {
  id: number;
  scheduleId: number;
  scheduleName?: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  itemsFound: number;
  errorMessage?: string;
  createdAt: string;
}

const schedules = ref<CrawlerSchedule[]>([]);
const logs = ref<CrawlerLog[]>([]);
const loadingSchedules = ref(true);
const loadingLogs = ref(true);
const running = ref(false);
const error = ref<string | null>(null);

// Fetch schedules
async function fetchSchedules() {
  try {
    loadingSchedules.value = true;
    error.value = null;
    const data = await $fetch<CrawlerSchedule[]>('/api/crawler/schedules');
    schedules.value = data;
  } catch (e: any) {
    error.value = e.message || 'Failed to load schedules';
    console.error('Error fetching schedules:', e);
  } finally {
    loadingSchedules.value = false;
  }
}

// Fetch logs
async function fetchLogs() {
  try {
    loadingLogs.value = true;
    const data = await $fetch<CrawlerLog[]>('/api/crawler/logs');
    logs.value = data;
  } catch (e: any) {
    console.error('Error fetching logs:', e);
  } finally {
    loadingLogs.value = false;
  }
}

// Run crawler manually
async function runCrawler() {
  if (running.value) return;

  try {
    running.value = true;
    error.value = null;

    const result = await $fetch<{ success: boolean; itemsFound: number; error?: string }>('/api/crawler/run', {
      method: 'POST',
    });

    if (result.success) {
      alert(`Crawler completed successfully! Found ${result.itemsFound} new items.`);
    } else {
      alert(`Crawler failed: ${result.error}`);
    }

    // Refresh data
    await Promise.all([fetchSchedules(), fetchLogs()]);
  } catch (e: any) {
    error.value = e.message || 'Failed to run crawler';
    console.error('Error running crawler:', e);
  } finally {
    running.value = false;
  }
}

// Toggle schedule active status
async function toggleScheduleActive(schedule: CrawlerSchedule) {
  try {
    await $fetch(`/api/crawler/schedules/${schedule.id}`, {
      method: 'PATCH',
      body: { isActive: !schedule.isActive },
    });

    // Update local state
    schedule.isActive = !schedule.isActive;
  } catch (e: any) {
    error.value = e.message || 'Failed to update schedule';
    console.error('Error updating schedule:', e);
  }
}

// Format date
function formatDate(date?: string) {
  if (!date) return 'Never';
  return new Date(date).toLocaleString('ja-JP');
}

// Get status badge class
function getStatusClass(status: string) {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'running':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Calculate duration
function getDuration(startedAt: string, completedAt?: string) {
  if (!completedAt) return 'In progress...';

  const start = new Date(startedAt).getTime();
  const end = new Date(completedAt).getTime();
  const diff = Math.floor((end - start) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ${diff % 60}s`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

// Load data on mount
onMounted(() => {
  fetchSchedules();
  fetchLogs();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">
        Crawler Management
      </h1>

      <button
        @click="runCrawler"
        :disabled="running"
        class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="running">Running...</span>
        <span v-else>Run Crawler Now</span>
      </button>
    </div>

    <p class="text-gray-600 mb-8">
      Monitor and control the automatic book release crawler
    </p>

    <!-- Error message -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Schedules -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">
        Crawler Schedules
      </h2>

      <div v-if="loadingSchedules" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>

      <div v-else-if="schedules.length === 0" class="text-gray-500 italic">
        No schedules configured
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="schedule in schedules"
          :key="schedule.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold">
                  {{ schedule.name }}
                </h3>
                <button
                  @click="toggleScheduleActive(schedule)"
                  class="text-sm px-3 py-1 rounded"
                  :class="schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                >
                  {{ schedule.isActive ? 'Active' : 'Inactive' }}
                </button>
              </div>

              <p v-if="schedule.description" class="text-gray-600 mb-2">
                {{ schedule.description }}
              </p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span class="font-medium">Frequency:</span>
                  <span class="ml-2 capitalize">{{ schedule.frequency }}</span>
                </div>
                <div>
                  <span class="font-medium">Last Run:</span>
                  <span class="ml-2">{{ formatDate(schedule.lastRunAt) }}</span>
                </div>
                <div>
                  <span class="font-medium">Next Run:</span>
                  <span class="ml-2">{{ formatDate(schedule.nextRunAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Execution Logs -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">
        Execution Logs
      </h2>

      <div v-if="loadingLogs" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>

      <div v-else-if="logs.length === 0" class="text-gray-500 italic">
        No execution logs yet
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Started
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items Found
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in logs" :key="log.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ log.scheduleName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded"
                  :class="getStatusClass(log.status)"
                >
                  {{ log.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(log.startedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getDuration(log.startedAt, log.completedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ log.itemsFound }}
              </td>
              <td class="px-6 py-4 text-sm text-red-600 max-w-xs truncate">
                {{ log.errorMessage || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
