import { describe, it, expect } from 'vitest';
import { sampleBooks } from '../data/books';

describe('sampleBooks', () => {
  it('contains 50 books', () => {
    expect(sampleBooks).toHaveLength(50);
  });
});
