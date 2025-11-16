#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Configuration
const BOOKSHELF_API_BASE_URL = process.env.BOOKSHELF_API_URL || 'http://localhost:3000';

// Schemas for validation
const BookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre is required'),
  cover: z.string().url().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

const BulkBooksSchema = z.object({
  books: z.array(BookSchema).min(1).max(100),
});

const SearchBooksSchema = z.object({
  query: z.string().optional(),
  genre: z.string().optional(),
  author: z.string().optional(),
});

// API helper functions
async function fetchBooks(params?: { query?: string; genre?: string; author?: string }) {
  const url = new URL('/api/books', BOOKSHELF_API_BASE_URL);
  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.statusText}`);
  }

  let books = await response.json();

  // Client-side filtering since the API returns all books
  if (params?.query) {
    const lowerQuery = params.query.toLowerCase();
    books = books.filter((book: any) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery)
    );
  }

  if (params?.genre) {
    books = books.filter((book: any) =>
      book.genre.toLowerCase() === params.genre!.toLowerCase()
    );
  }

  if (params?.author) {
    const lowerAuthor = params.author.toLowerCase();
    books = books.filter((book: any) =>
      book.author.toLowerCase().includes(lowerAuthor)
    );
  }

  return books;
}

async function addBook(bookData: z.infer<typeof BookSchema>) {
  const url = new URL('/api/books', BOOKSHELF_API_BASE_URL);
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to add book: ${error}`);
  }

  return await response.json();
}

async function addBulkBooks(books: z.infer<typeof BookSchema>[]) {
  const url = new URL('/api/books/bulk', BOOKSHELF_API_BASE_URL);
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ books }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to add books: ${error}`);
  }

  return await response.json();
}

// Create MCP Server
const server = new Server(
  {
    name: 'bookshelf-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'add_book',
        description: `Add a single book to the bookshelf. Use this when you've analyzed a photo and identified a book.

Required parameters:
- title: The book's title
- author: The book's author name
- genre: The book's genre (e.g., Fiction, Sci-Fi, Fantasy, Horror, Thriller, YA, Classic, Historical, Dystopian, Adventure)

Optional parameters:
- cover: URL to the book's cover image
- color: Hex color code for the book's theme (e.g., #FF6347)`,
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the book',
            },
            author: {
              type: 'string',
              description: 'The author of the book',
            },
            genre: {
              type: 'string',
              description: 'The genre of the book (e.g., Fiction, Sci-Fi, Fantasy, Horror, Thriller, YA, Classic, Historical)',
            },
            cover: {
              type: 'string',
              description: 'URL to the cover image (optional)',
            },
            color: {
              type: 'string',
              description: 'Hex color code for the book theme (e.g., #FF6347) (optional)',
            },
          },
          required: ['title', 'author', 'genre'],
        },
      },
      {
        name: 'add_bulk_books',
        description: `Add multiple books to the bookshelf at once. Perfect for when you've analyzed a bookshelf photo and identified multiple books.

Each book requires:
- title: The book's title
- author: The book's author name
- genre: The book's genre

Optional for each book:
- cover: URL to the book's cover image
- color: Hex color code for the book's theme

Maximum 100 books can be added at once.`,
        inputSchema: {
          type: 'object',
          properties: {
            books: {
              type: 'array',
              description: 'Array of books to add',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'The title of the book',
                  },
                  author: {
                    type: 'string',
                    description: 'The author of the book',
                  },
                  genre: {
                    type: 'string',
                    description: 'The genre of the book',
                  },
                  cover: {
                    type: 'string',
                    description: 'URL to the cover image (optional)',
                  },
                  color: {
                    type: 'string',
                    description: 'Hex color code (optional)',
                  },
                },
                required: ['title', 'author', 'genre'],
              },
            },
          },
          required: ['books'],
        },
      },
      {
        name: 'search_books',
        description: `Search for books in the bookshelf. Use this to check if a book already exists before adding it.

Optional parameters:
- query: Search in title or author
- genre: Filter by specific genre
- author: Filter by author name`,
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query to match against title or author',
            },
            genre: {
              type: 'string',
              description: 'Filter by genre',
            },
            author: {
              type: 'string',
              description: 'Filter by author name',
            },
          },
        },
      },
      {
        name: 'list_all_books',
        description: 'Get a list of all books currently in the bookshelf. Useful for seeing what books are already registered.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_genres',
        description: 'Get a list of all available genres in the bookshelf. Useful for determining which genre to assign to a book.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'add_book': {
        const validated = BookSchema.parse(args);
        const result = await addBook(validated);
        return {
          content: [
            {
              type: 'text',
              text: `Successfully added book:\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'add_bulk_books': {
        const validated = BulkBooksSchema.parse(args);
        const result = await addBulkBooks(validated.books);
        return {
          content: [
            {
              type: 'text',
              text: `Bulk add result:\n- Successfully added: ${result.created.length} books\n- Errors: ${result.errors.length}\n\nCreated books:\n${JSON.stringify(result.created, null, 2)}${result.errors.length > 0 ? `\n\nErrors:\n${JSON.stringify(result.errors, null, 2)}` : ''}`,
            },
          ],
        };
      }

      case 'search_books': {
        const validated = SearchBooksSchema.parse(args);
        const books = await fetchBooks(validated);
        return {
          content: [
            {
              type: 'text',
              text: `Found ${books.length} book(s):\n${JSON.stringify(books, null, 2)}`,
            },
          ],
        };
      }

      case 'list_all_books': {
        const books = await fetchBooks();
        return {
          content: [
            {
              type: 'text',
              text: `Total books in bookshelf: ${books.length}\n${JSON.stringify(books, null, 2)}`,
            },
          ],
        };
      }

      case 'get_genres': {
        const books = await fetchBooks();
        const genres = [...new Set(books.map((book: any) => book.genre))].sort();
        return {
          content: [
            {
              type: 'text',
              text: `Available genres (${genres.length}):\n${genres.join('\n')}`,
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
      );
    }
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Bookshelf MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
