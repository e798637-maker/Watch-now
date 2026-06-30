import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  avatar: string;
  createdAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150?text=Profile',
    },
  },
  {
    timestamps: true,
  }
);

// Index to ensure max 4 profiles per user
profileSchema.index({ userId: 1 });

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
