import { pgTable, text, integer, real, boolean, timestamp, uniqueIndex, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:        serial("id").primaryKey(),
  email:     text("email").notNull().unique(),
  password:  text("password").notNull(),
  username:  text("username").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name:      text("name").notNull(),
  avatar:    text("avatar").default("https://via.placeholder.com/150?text=Profile"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const works = pgTable("works", {
  id:          serial("id").primaryKey(),
  title:       text("title").notNull(),
  description: text("description").notNull(),
  type:        text("type").notNull(),        // movie | series | play
  genre:       text("genre").array().default([]),
  year:        integer("year").notNull(),
  director:    text("director").notNull(),
  cast:        text("cast").array().default([]),
  poster:      text("poster").notNull(),
  thumbnail:   text("thumbnail").notNull(),
  videoUrl:    text("video_url").notNull(),
  videoFileId: text("video_file_id"),
  subtitles:   text("subtitles").default("[]"), // JSON string
  duration:    integer("duration").notNull(),
  rating:      real("rating").default(0),
  createdAt:   timestamp("created_at").defaultNow(),
  updatedAt:   timestamp("updated_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id:        serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  workId:    integer("work_id").notNull().references(() => works.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  uniq: uniqueIndex("favorites_profile_work_uniq").on(t.profileId, t.workId),
}));

export const watchlist = pgTable("watchlist", {
  id:        serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  workId:    integer("work_id").notNull().references(() => works.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  uniq: uniqueIndex("watchlist_profile_work_uniq").on(t.profileId, t.workId),
}));

export const ratings = pgTable("ratings", {
  id:        serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  workId:    integer("work_id").notNull().references(() => works.id, { onDelete: "cascade" }),
  rating:    integer("rating").notNull(),
  review:    text("review").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => ({
  uniq: uniqueIndex("ratings_profile_work_uniq").on(t.profileId, t.workId),
}));

export const userProgress = pgTable("user_progress", {
  id:            serial("id").primaryKey(),
  profileId:     integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  workId:        integer("work_id").notNull().references(() => works.id, { onDelete: "cascade" }),
  currentTime:   real("current_time").default(0),
  duration:      real("duration").notNull(),
  isCompleted:   boolean("is_completed").default(false),
  lastWatchedAt: timestamp("last_watched_at").defaultNow(),
}, (t) => ({
  uniq: uniqueIndex("progress_profile_work_uniq").on(t.profileId, t.workId),
}));
