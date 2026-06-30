import { neon } from "@neondatabase/serverless";

let migrated = false;

export async function runMigrations() {
  if (migrated) return;
  const sql = neon(process.env.DATABASE_URL!);

  await sql(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      avatar TEXT DEFAULT 'https://via.placeholder.com/150?text=Profile',
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS works (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      genre TEXT[] DEFAULT '{}',
      year INTEGER NOT NULL,
      director TEXT NOT NULL,
      cast TEXT[] DEFAULT '{}',
      poster TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      video_url TEXT NOT NULL,
      video_file_id TEXT,
      subtitles TEXT DEFAULT '[]',
      duration INTEGER NOT NULL,
      rating REAL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      work_id INTEGER NOT NULL REFERENCES works(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT favorites_profile_work_uniq UNIQUE(profile_id, work_id)
    );
    CREATE TABLE IF NOT EXISTS watchlist (
      id SERIAL PRIMARY KEY,
      profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      work_id INTEGER NOT NULL REFERENCES works(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT watchlist_profile_work_uniq UNIQUE(profile_id, work_id)
    );
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      work_id INTEGER NOT NULL REFERENCES works(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL,
      review TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT ratings_profile_work_uniq UNIQUE(profile_id, work_id)
    );
    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      work_id INTEGER NOT NULL REFERENCES works(id) ON DELETE CASCADE,
      current_time REAL DEFAULT 0,
      duration REAL NOT NULL,
      is_completed BOOLEAN DEFAULT FALSE,
      last_watched_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT progress_profile_work_uniq UNIQUE(profile_id, work_id)
    );
  `);

  migrated = true;
  console.log("✅ DB migrations applied");
}
