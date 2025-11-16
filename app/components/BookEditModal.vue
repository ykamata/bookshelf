<script setup lang="ts">
import type { Book } from '~~/data/books';

interface Props {
  book: Book | null;
  isOpen: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', updatedBook: Partial<Book>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref({
  title: '',
  author: '',
  genre: '',
  cover: '',
  color: '',
});

const errors = ref({
  title: '',
  author: '',
  genre: '',
  cover: '',
});

// Watch for book changes to update form data
watch(() => props.book, (newBook) => {
  if (newBook) {
    formData.value = {
      title: newBook.title,
      author: newBook.author,
      genre: newBook.genre,
      cover: newBook.cover,
      color: newBook.color || '',
    };
    // Reset errors
    errors.value = {
      title: '',
      author: '',
      genre: '',
      cover: '',
    };
  }
}, { immediate: true });

const validateForm = (): boolean => {
  let isValid = true;
  errors.value = {
    title: '',
    author: '',
    genre: '',
    cover: '',
  };

  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required';
    isValid = false;
  }

  if (!formData.value.author.trim()) {
    errors.value.author = 'Author is required';
    isValid = false;
  }

  if (!formData.value.genre.trim()) {
    errors.value.genre = 'Genre is required';
    isValid = false;
  }

  if (!formData.value.cover.trim()) {
    errors.value.cover = 'Cover URL is required';
    isValid = false;
  }
  else {
    try {
      new URL(formData.value.cover);
    }
    catch {
      errors.value.cover = 'Invalid URL format';
      isValid = false;
    }
  }

  return isValid;
};

const handleSave = () => {
  if (validateForm()) {
    emit('save', {
      title: formData.value.title,
      author: formData.value.author,
      genre: formData.value.genre,
      cover: formData.value.cover,
      color: formData.value.color || undefined,
    });
  }
};

const handleClose = () => {
  emit('close');
};

// Close modal on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen && book"
      class="modal-overlay"
      @click.self="handleClose"
    >
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">
            Edit Book
          </h2>
          <button
            class="close-button"
            @click="handleClose"
          >
            ×
          </button>
        </div>

        <form
          class="modal-body"
          @submit.prevent="handleSave"
        >
          <div class="form-group">
            <label for="title">Title</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="form-input"
              :class="{ error: errors.title }"
            >
            <span
              v-if="errors.title"
              class="error-message"
            >{{ errors.title }}</span>
          </div>

          <div class="form-group">
            <label for="author">Author</label>
            <input
              id="author"
              v-model="formData.author"
              type="text"
              class="form-input"
              :class="{ error: errors.author }"
            >
            <span
              v-if="errors.author"
              class="error-message"
            >{{ errors.author }}</span>
          </div>

          <div class="form-group">
            <label for="genre">Genre</label>
            <input
              id="genre"
              v-model="formData.genre"
              type="text"
              class="form-input"
              :class="{ error: errors.genre }"
            >
            <span
              v-if="errors.genre"
              class="error-message"
            >{{ errors.genre }}</span>
          </div>

          <div class="form-group">
            <label for="cover">Cover URL</label>
            <input
              id="cover"
              v-model="formData.cover"
              type="text"
              class="form-input"
              :class="{ error: errors.cover }"
            >
            <span
              v-if="errors.cover"
              class="error-message"
            >{{ errors.cover }}</span>
          </div>

          <div class="form-group">
            <label for="color">Color (optional)</label>
            <div class="color-input-group">
              <input
                id="color"
                v-model="formData.color"
                type="text"
                class="form-input"
                placeholder="#FF6347"
              >
              <input
                v-model="formData.color"
                type="color"
                class="color-picker"
              >
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="handleClose"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
}

.color-picker {
  width: 3rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s, opacity 0.2s;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}
</style>
