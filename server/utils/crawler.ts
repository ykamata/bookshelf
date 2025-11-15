import type { UserPreference, NewRelease } from '../types';
import { query } from './db';

interface OpenBDBook {
  summary: {
    isbn: string;
    title: string;
    author?: string;
    publisher?: string;
    pubdate?: string;
    cover?: string;
  };
  onix?: {
    DescriptiveDetail?: {
      TitleDetail?: {
        TitleElement?: Array<{
          TitleText?: {
            content: string;
          };
        }>;
      };
      Contributor?: Array<{
        PersonName?: {
          content: string;
        };
      }>;
    };
    PublishingDetail?: {
      Imprint?: {
        ImprintName?: string;
      };
      PublishingDate?: Array<{
        Date?: string;
      }>;
    };
    ProductSupply?: {
      SupplyDetail?: {
        Price?: Array<{
          PriceAmount?: string;
        }>;
      };
    };
    CollateralDetail?: {
      TextContent?: Array<{
        Text?: string;
      }>;
    };
  };
}

/**
 * Fetch book information from OpenBD API
 * OpenBD is a free API for Japanese book data
 */
async function fetchFromOpenBD(isbn: string): Promise<OpenBDBook | null> {
  try {
    const response = await fetch(`https://api.openbd.jp/v1/get?isbn=${isbn}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Failed to fetch book ${isbn}:`, error);
    return null;
  }
}

/**
 * Search for new releases on Honto (Japanese book store)
 * This is a simplified example - in production, you'd need proper scraping with respect to terms of service
 */
async function searchNewReleases(options: {
  genre?: string;
  publisher?: string;
  limit?: number;
}): Promise<string[]> {
  // In a real implementation, this would:
  // 1. Check publisher RSS feeds
  // 2. Query OpenBD for recent ISBNs
  // 3. Scrape book store websites (with proper permission)

  // For now, return empty array - this needs to be implemented based on available data sources
  console.log('Searching for new releases:', options);
  return [];
}

/**
 * Fetch user preferences from database
 */
async function getUserPreferences(): Promise<UserPreference[]> {
  const results = await query<any>(
    'SELECT * FROM user_preferences WHERE is_active = 1'
  );

  return results.map(row => ({
    id: row.id,
    preferenceType: row.preference_type,
    value: row.value,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Check if a book matches user preferences
 */
function matchesPreferences(book: any, preferences: UserPreference[]): boolean {
  if (preferences.length === 0) {
    return true; // If no preferences, match everything
  }

  for (const pref of preferences) {
    switch (pref.preferenceType) {
      case 'genre':
        if (book.genre && book.genre.toLowerCase().includes(pref.value.toLowerCase())) {
          return true;
        }
        break;
      case 'publisher':
        if (book.publisherName && book.publisherName.toLowerCase().includes(pref.value.toLowerCase())) {
          return true;
        }
        break;
      case 'author':
        if (book.author && book.author.toLowerCase().includes(pref.value.toLowerCase())) {
          return true;
        }
        break;
      case 'keyword':
        const searchText = `${book.title} ${book.description || ''}`.toLowerCase();
        if (searchText.includes(pref.value.toLowerCase())) {
          return true;
        }
        break;
    }
  }

  return false;
}

/**
 * Save a new release to database
 */
async function saveNewRelease(book: any): Promise<void> {
  try {
    // Check if already exists by ISBN
    if (book.isbn) {
      const existing = await query<any>(
        'SELECT id FROM new_releases WHERE isbn = ?',
        [book.isbn]
      );

      if (existing.length > 0) {
        console.log(`Book ${book.isbn} already exists, skipping`);
        return;
      }
    }

    // Get publisher ID if exists
    let publisherId = null;
    if (book.publisherName) {
      const publisher = await query<any>(
        'SELECT id FROM publishers WHERE name = ?',
        [book.publisherName]
      );

      if (publisher.length > 0) {
        publisherId = publisher[0].id;
      }
    }

    await query(
      `INSERT INTO new_releases
       (title, author, publisher_id, publisher_name, genre, isbn, publication_date,
        cover_url, price, description, source_url, crawled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        book.title,
        book.author || '',
        publisherId,
        book.publisherName || null,
        book.genre || null,
        book.isbn || null,
        book.publicationDate || null,
        book.coverUrl || null,
        book.price || null,
        book.description || null,
        book.sourceUrl,
      ]
    );

    console.log(`Saved new release: ${book.title}`);
  } catch (error) {
    console.error('Failed to save new release:', error);
  }
}

/**
 * Main crawler function
 */
export async function runCrawler(): Promise<{ itemsFound: number; error?: string }> {
  try {
    console.log('Starting crawler...');

    // Get user preferences
    const preferences = await getUserPreferences();
    console.log(`Found ${preferences.length} active preferences`);

    let itemsFound = 0;

    // Get active publishers
    const publishers = await query<any>(
      'SELECT * FROM publishers WHERE is_active = 1'
    );

    // For each publisher, check their RSS feed or website
    for (const publisher of publishers) {
      console.log(`Checking publisher: ${publisher.name}`);

      if (publisher.rss_url) {
        // TODO: Parse RSS feed and extract book information
        console.log(`Would parse RSS feed: ${publisher.rss_url}`);
      }

      if (publisher.website_url) {
        // TODO: Scrape website for new releases
        console.log(`Would scrape website: ${publisher.website_url}`);
      }
    }

    // Search for books matching preferences
    const genrePrefs = preferences.filter(p => p.preferenceType === 'genre');
    const publisherPrefs = preferences.filter(p => p.preferenceType === 'publisher');

    // Example: Fetch recent ISBNs (in practice, you'd get these from a source)
    // This is where you'd integrate with actual data sources
    const recentISBNs: string[] = [];

    for (const isbn of recentISBNs) {
      const bookData = await fetchFromOpenBD(isbn);
      if (!bookData) continue;

      const book = {
        title: bookData.summary?.title || '',
        author: bookData.summary?.author || '',
        publisherName: bookData.summary?.publisher || '',
        isbn: bookData.summary?.isbn || '',
        publicationDate: bookData.summary?.pubdate || null,
        coverUrl: bookData.summary?.cover || null,
        price: null,
        description: bookData.onix?.CollateralDetail?.TextContent?.[0]?.Text || null,
        sourceUrl: `https://openbd.jp/${isbn}`,
        genre: null, // OpenBD doesn't provide genre directly
      };

      if (matchesPreferences(book, preferences)) {
        await saveNewRelease(book);
        itemsFound++;
      }
    }

    console.log(`Crawler completed. Found ${itemsFound} new items.`);
    return { itemsFound };
  } catch (error: any) {
    console.error('Crawler error:', error);
    return { itemsFound: 0, error: error.message };
  }
}

/**
 * Parse RSS feed (example implementation)
 */
async function parseRSSFeed(url: string): Promise<any[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();

    // Simple RSS parsing - in production use a proper XML parser
    const items: any[] = [];

    // Extract items from RSS feed
    // This is a simplified example
    const itemMatches = text.match(/<item>(.*?)<\/item>/gs);

    if (itemMatches) {
      for (const itemText of itemMatches) {
        const title = itemText.match(/<title>(.*?)<\/title>/)?.[1];
        const link = itemText.match(/<link>(.*?)<\/link>/)?.[1];
        const pubDate = itemText.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];

        if (title && link) {
          items.push({ title, link, pubDate });
        }
      }
    }

    return items;
  } catch (error) {
    console.error('Failed to parse RSS feed:', error);
    return [];
  }
}
