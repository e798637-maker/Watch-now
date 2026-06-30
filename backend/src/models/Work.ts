import mongoose, { Schema, Document } from 'mongoose';

export interface ISubtitle {
  language: string;
  url: string;
  uploadedAt: Date;
}

export interface IWork extends Document {
  title: string;
  description: string;
  type: 'movie' | 'series' | 'play';
  genre: string[];
  year: number;
  director: string;
  cast: string[];
  poster: string;
  thumbnail: string;
  videoUrl: string;
  videoFileId?: string; // Cloudinary file ID
  subtitles: ISubtitle[];
  duration: number; // in minutes
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const subtitleSchema = new Schema<ISubtitle>(
  {
    language: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const workSchema = new Schema<IWork>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['movie', 'series', 'play'],
      required: true,
    },
    genre: [
      {
        type: String,
      },
    ],
    year: {
      type: Number,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    cast: [
      {
        type: String,
      },
    ],
    poster: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    videoFileId: {
      type: String,
    },
    subtitles: [subtitleSchema],
    duration: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

export const Work = mongoose.model<IWork>('Work', workSchema);
