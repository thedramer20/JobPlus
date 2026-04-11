import { http } from "../lib/http";
import type { Post, PostCategory } from "../types/post";

interface PostDto {
  id: number;
  userId: number;
  authorUsername: string;
  authorFullName: string;
  categoryId: number;
  categoryName: string;
  content: string;
  imageUrl?: string | null;
  likeCount: number;
  likedByCurrentUser: boolean;
  createdAt?: string | null;
}

interface PostCategoryDto {
  id: number;
  name: string;
  description: string | null;
  createdAt?: string | null;
}

export async function listPosts(): Promise<Post[]> {
  const { data } = await http.get<PostDto[]>("/posts");
  return data.map(mapPost);
}

export async function listTrendingPosts(): Promise<Post[]> {
  const { data } = await http.get<PostDto[]>("/posts/trending");
  return data.map(mapPost);
}

export async function createPost(payload: { categoryId?: number; content: string; imageUrl?: string }): Promise<Post> {
  const { data } = await http.post<PostDto>("/posts", payload);
  return mapPost(data);
}

export async function togglePostLike(postId: number): Promise<Post> {
  const { data } = await http.post<PostDto>(`/posts/${postId}/likes`);
  return mapPost(data);
}

export async function listPostCategories(): Promise<PostCategory[]> {
  const { data } = await http.get<PostCategoryDto[]>("/post-categories");
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    createdAt: item.createdAt ?? undefined
  }));
}

function mapPost(item: PostDto): Post {
  return {
    id: item.id,
    userId: item.userId,
    authorUsername: item.authorUsername,
    authorFullName: item.authorFullName,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    content: item.content,
    imageUrl: item.imageUrl ?? undefined,
    likeCount: item.likeCount,
    likedByCurrentUser: item.likedByCurrentUser,
    createdAt: item.createdAt ?? undefined
  };
}
