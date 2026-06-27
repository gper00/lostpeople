import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { Comment as CommentType } from '@/types/comment';

export interface CommentDocument extends Omit<CommentType, '_id'>, Document {}

const commentSchema = new Schema<CommentDocument>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    // Set for logged-in authors; null for anonymous guests.
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestName: {
      type: String,
      trim: true,
      maxLength: 60,
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, 'Comment cannot be empty'],
      maxLength: [2000, 'Comment must not exceed 2000 characters'],
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: -1 });

const Comment: Model<CommentDocument> =
  mongoose.models.Comment || mongoose.model<CommentDocument>('Comment', commentSchema);

export default Comment;
