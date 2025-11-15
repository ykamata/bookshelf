// Database models
export interface UserPreference {
  id: number;
  preferenceType: string; // 'genre', 'publisher', 'author', 'keyword'
  value: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Publisher {
  id: number;
  name: string;
  websiteUrl?: string;
  rssUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewRelease {
  id: number;
  title: string;
  author: string;
  publisherId?: number;
  publisherName?: string;
  genre?: string;
  isbn?: string;
  publicationDate?: Date;
  coverUrl?: string;
  price?: number;
  description?: string;
  sourceUrl: string;
  crawledAt: Date;
  isNotified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrawlerSchedule {
  id: number;
  name: string;
  description?: string;
  frequency: string; // 'daily', 'weekly'
  lastRunAt?: Date;
  nextRunAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrawlerLog {
  id: number;
  scheduleId: number;
  status: string; // 'running', 'success', 'failed'
  startedAt: Date;
  completedAt?: Date;
  itemsFound: number;
  errorMessage?: string;
  createdAt: Date;
}

// API request/response types
export interface CreatePreferenceRequest {
  preferenceType: 'genre' | 'publisher' | 'author' | 'keyword';
  value: string;
}

export interface UpdatePreferenceRequest {
  value?: string;
  isActive?: boolean;
}

export interface CreatePublisherRequest {
  name: string;
  websiteUrl?: string;
  rssUrl?: string;
}

export interface UpdatePublisherRequest {
  name?: string;
  websiteUrl?: string;
  rssUrl?: string;
  isActive?: boolean;
}

export interface NewReleasesQuery {
  genre?: string;
  author?: string;
  publisher?: string;
  startDate?: string;
  endDate?: string;
  isNotified?: boolean;
  limit?: number;
  offset?: number;
}
