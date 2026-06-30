import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  profileId: mongoose.Types.ObjectId;
  workId: mongoose.Types.ObjectId;
  addedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
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

// Ensure no duplicate favorites
favoriteSchema.index({ profileId: 1, workId: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);
