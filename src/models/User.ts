import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { User as UserType } from '@/types/user';

export interface UserDocument extends Omit<UserType, '_id'>, Document {}

const userSchema = new Schema<UserDocument>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 100,
      match: /^\S+@\S+\.\S+$/,
    },
    // Credentials live in Better Auth's `account` collection — not required here.
    password: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      default: null,
      maxLength: 400,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'super-admin'],
      default: 'user',
    },
    image: {
      type: String,
      default: null,
    },
    socialMedia: {
      facebook: { type: String, default: null, trim: true, maxLength: 150 },
      instagram: { type: String, default: null, trim: true, maxLength: 150 },
      twitter: { type: String, default: null, trim: true, maxLength: 150 },
      whatsapp: { type: String, default: null, trim: true, maxLength: 150 },
      telegram: { type: String, default: null, trim: true, maxLength: 150 },
    },
  },
  { timestamps: true }
);

const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;
