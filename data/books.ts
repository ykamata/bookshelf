export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover: string;
}

export const sampleBooks: Book[] = [
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
  {
    id: 5,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic',
    cover: 'https://placehold.co/150x200?text=Mockingbird',
  },
  {
    id: 6,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    cover: 'https://placehold.co/150x200?text=Catcher',
  },
  {
    id: 7,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Classic',
    cover: 'https://placehold.co/150x200?text=Pride',
  },
  {
    id: 8,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    cover: 'https://placehold.co/150x200?text=Hobbit',
  },
  {
    id: 9,
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    genre: 'Dystopian',
    cover: 'https://placehold.co/150x200?text=F451',
  },
  {
    id: 10,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    genre: 'Historical',
    cover: 'https://placehold.co/150x200?text=WarPeace',
  },
];
