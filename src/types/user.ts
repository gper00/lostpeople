export interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: 'super-admin' | 'admin';
  bio: string | null;
  image: string | null;
  socialMedia: SocialMedia;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMedia {
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  whatsapp: string | null;
  telegram: string | null;
}

export type CreateUserInput = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>> & { password?: string };

export type SafeUser = Omit<User, 'password'>;
