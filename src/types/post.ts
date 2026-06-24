export interface Post {
  _id: string;
  title: string;
  slug: string;
  userId: string | UserRef;
  category: string | null;
  thumbnail: string | null;
  tags: string[];
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRef {
  _id: string;
  fullname: string;
  username: string;
  image: string | null;
}

export type CreatePostInput = Omit<Post, '_id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'userId'> & {
  userId: string;
};

export type UpdatePostInput = Partial<Omit<CreatePostInput, 'userId'>>;
