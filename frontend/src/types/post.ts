export interface Post {
  id: number;
  userId: number;
  authorUsername: string;
  authorFullName: string;
  categoryId: number;
  categoryName: string;
  content: string;
  imageUrl?: string;
  likeCount: number;
  likedByCurrentUser: boolean;
  createdAt?: string;
}

export interface PostCategory {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
}
