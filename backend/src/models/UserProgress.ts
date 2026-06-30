import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  profileId: mongoose.Types.ObjectId;
  workId: mongoose.Types.ObjectId;
  currentTime: number; // in seconds
  duration: number; // in seconds
  isCompleted: boolean;
  lastWatchedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>(
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
    currentTime: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one progress entry per profile-work combination
userProgressSchema.index({ profileId: 1, workId: 1 }, { unique: true });

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', userProgressSchema);
