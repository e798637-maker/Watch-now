import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlist extends Document {
  profileId: mongoose.Types.ObjectId;
  workId: mongoose.Types.ObjectId;
  addedAt: Date;
}

const watchlistSchema = new Schema<IWatchlist>(
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
  },
  {
    timestamps: true,
  }
);

// Ensure no duplicate watchlist entries
watchlistSchema.index({ profileId: 1, workId: 1 }, { unique: true });

export const Watchlist = mongoose.model<IWatchlist>('Watchlist', watchlistSchema);
