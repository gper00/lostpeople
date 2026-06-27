import type { UserRef } from './post';

export interface Comment {
  _id: string;
  postId: string;
  /** Set when the author was logged in. Null for guest comments. */
  userId: string | UserRef | null;
  /** Display name for guest comments (ignored when userId is set). */
  guestName: string | null;
  content: string;
  /** Hidden comments are kept in the DB but not shown to the public. */
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Shape returned to the client by the comments API. */
export interface CommentView {
  _id: string;
  authorName: string;
  authorImage: string | null;
  /** True when posted by a registered user (vs an anonymous guest). */
  isRegistered: boolean;
  content: string;
  hidden: boolean;
  /** True when the current viewer may delete this comment. */
  canDelete: boolean;
  createdAt: string;
}
