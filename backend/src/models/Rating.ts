import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  profileId: mongoose.Types.ObjectId;
  workId: mongoose.Types.ObjectId;
  rating: number; // 1-5
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    workId: {
      type: Schema.Types.ObjectId,
      ref: 'Work',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one rating per profile-work combination
ratingSchema.index({ profileId: 1, workId: 1 }, { unique: true });

export const Rating = mongoose.model<IRating>('Rating', ratingSchema);
