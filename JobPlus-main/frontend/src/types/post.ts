export interface Post {
  id: number;
  userId: number;
  authorUsername: string;
  authorFullName: string;
  authorTitle?: string;
  avatarUrl?: string;
  categoryId: number;
  categoryName: string;
  content: string;
  imageUrl?: string;
  likeCount: number;
  commentCount?: number;
  likedByCurrentUser: boolean;
  createdAt?: string;
}

export interface PostCategory {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
}

export interface PostComment {
  id: number;
  postId: number;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
}
