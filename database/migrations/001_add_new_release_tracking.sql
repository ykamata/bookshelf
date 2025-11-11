-- Migration: Add new release tracking tables
-- Created: 2025-11-11

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  preference_type VARCHAR(50) NOT NULL COMMENT 'genre, publisher, author, keyword',
  value VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_preference_type (preference_type),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Publishers table
CREATE TABLE IF NOT EXISTS publishers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  website_url VARCHAR(500) DEFAULT NULL,
  rss_url VARCHAR(500) DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- New releases table
CREATE TABLE IF NOT EXISTS new_releases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publisher_id INT DEFAULT NULL,
  publisher_name VARCHAR(255) DEFAULT NULL,
  genre VARCHAR(100) DEFAULT NULL,
  isbn VARCHAR(20) DEFAULT NULL UNIQUE,
  publication_date DATE DEFAULT NULL,
  cover_url VARCHAR(500) DEFAULT NULL,
  price INT DEFAULT NULL COMMENT 'Price in cents/yen',
  description TEXT DEFAULT NULL,
  source_url VARCHAR(500) NOT NULL,
  crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (publisher_id) REFERENCES publishers(id) ON DELETE SET NULL,
  INDEX idx_publisher_id (publisher_id),
  INDEX idx_genre (genre),
  INDEX idx_author (author),
  INDEX idx_publication_date (publication_date),
  INDEX idx_crawled_at (crawled_at),
  INDEX idx_is_notified (is_notified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crawler schedules table
CREATE TABLE IF NOT EXISTS crawler_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  frequency VARCHAR(20) NOT NULL COMMENT 'daily, weekly',
  last_run_at TIMESTAMP DEFAULT NULL,
  next_run_at TIMESTAMP DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crawler logs table
CREATE TABLE IF NOT EXISTS crawler_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schedule_id INT NOT NULL,
  status VARCHAR(20) NOT NULL COMMENT 'running, success, failed',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP DEFAULT NULL,
  items_found INT DEFAULT 0,
  error_message TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_id) REFERENCES crawler_schedules(id) ON DELETE CASCADE,
  INDEX idx_schedule_id (schedule_id),
  INDEX idx_status (status),
  INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
