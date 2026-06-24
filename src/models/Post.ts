import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { Post as PostType } from '@/types/post';

export interface PostDocument extends Omit<PostType, '_id'>, Document {}

const postSchema = new Schema<PostDocument>(
  {
    title: {
      type: String,
      required: true,
      minLength: [10, 'Title cannot be less than 10 characters'],
      maxLength: [255, 'Title must not exceed 255 characters'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      trim: true,
      maxLength: 25,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
        maxLength: [25, 'Each tag cannot be more than 25 characters'],
        trim: true,
        default: null,
      },
    ],
    excerpt: {
      type: String,
      required: true,
      minLength: [30, 'Excerpt cannot be less than 30 characters'],
      maxLength: [500, 'Excerpt must not exceed 500 characters'],
    },
    content: {
      type: String,
      required: true,
      minLength: [100, 'Content must be at least 100 characters long'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, createdAt: -1 });

const Post: Model<PostDocument> =
  mongoose.models.Post || mongoose.model<PostDocument>('Post', postSchema);

export default Post;
