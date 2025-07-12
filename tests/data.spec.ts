import { describe, it, expect } from 'vitest';
import { sampleBooks } from '../data/books';

describe('sampleBooks', () => {
  it('contains 10 books', () => {
    expect(sampleBooks).toHaveLength(10);
  });
});
