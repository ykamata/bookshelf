import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BookCard from '../../app/components/BookCard.vue';
import type { Book } from '../../data/books';

const book: Book = {
  id: 1,
  title: 'Test Book',
  author: 'Tester',
  genre: 'Fiction',
  cover: 'https://placehold.co/150x200',
};

describe('BookCard', () => {
  it('renders title and author', () => {
    const wrapper = mount(BookCard, { props: { book } });
    expect(wrapper.text()).toContain('Test Book');
    expect(wrapper.text()).toContain('Tester');
  });
});
