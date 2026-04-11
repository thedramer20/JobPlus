import { http } from "../lib/http";
import { demoCategories, demoPosts } from "../mocks/demo-content";
import type { Post, PostCategory, PostComment } from "../types/post";

interface PostDto {
  id: number;
  userId: number;
  authorUsername: string;
  authorFullName: string;
  authorTitle?: string | null;
  avatarUrl?: string | null;
  categoryId: number;
  categoryName: string;
  content: string;
  imageUrl?: string | null;
  likeCount: number;
  commentCount?: number;
  likedByCurrentUser: boolean;
  createdAt?: string | null;
}

interface PostCategoryDto {
  id: number;
  name: string;
  description: string | null;
  createdAt?: string | null;
}

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== "false";
let demoPostsStore: Post[] = demoPosts.map((item) => ({ ...item }));
let demoNextPostId = Math.max(...demoPostsStore.map((item) => item.id), 0) + 1;
let demoNextCommentId = 10000;

const demoCommentAuthors = [
  {
    name: "Lina Morgan",
    title: "Lifecycle Marketing Manager",
    avatarUrl: "https://i.pravatar.cc/120?img=24"
  },
  {
    name: "Omar Rahman",
    title: "Business Operations Director",
    avatarUrl: "https://i.pravatar.cc/120?img=33"
  },
  {
    name: "Maya Chen",
    title: "Product Engineer",
    avatarUrl: "https://i.pravatar.cc/120?img=55"
  }
];

const demoCommentTexts = [
  "Great point. We applied a similar approach and saw better engagement.",
  "Thanks for sharing this. The execution details are really useful.",
  "I agree. This is one of the most practical workflows for teams."
];

let demoCommentsStore: Record<number, PostComment[]> = seedDemoComments();

export async function listPosts(): Promise<Post[]> {
  if (DEMO_MODE) {
    return getDemoPostsSorted();
  }

  try {
    const { data } = await http.get<PostDto[]>("/posts");
    return data.map(mapPost);
  } catch {
    return getDemoPostsSorted();
  }
}

export async function listTrendingPosts(): Promise<Post[]> {
  if (DEMO_MODE) {
    return getDemoTrendingPosts();
  }

  try {
    const { data } = await http.get<PostDto[]>("/posts/trending");
    return data.map(mapPost);
  } catch {
    return getDemoTrendingPosts();
  }
}

export async function createPost(payload: { categoryId?: number; content: string; imageUrl?: string }): Promise<Post> {
  if (DEMO_MODE) {
    const category = resolveCategoryForDemo(payload.categoryId, payload.content);
    const post: Post = {
      id: demoNextPostId++,
      userId: 1,
      authorUsername: "you",
      authorFullName: "You",
      authorTitle: "JobPlus Member",
      avatarUrl: "https://i.pravatar.cc/120?img=3",
      categoryId: category.id,
      categoryName: category.name,
      content: payload.content.trim(),
      imageUrl: payload.imageUrl?.trim() || undefined,
      likeCount: 0,
      commentCount: 0,
      likedByCurrentUser: false,
      createdAt: new Date().toISOString()
    };
    demoPostsStore = [post, ...demoPostsStore];
    return { ...post };
  }

  const { data } = await http.post<PostDto>("/posts", payload);
  return mapPost(data);
}

export async function togglePostLike(postId: number): Promise<Post> {
  if (DEMO_MODE) {
    const target = demoPostsStore.find((item) => item.id === postId);
    if (!target) {
      throw new Error("Post not found.");
    }
    const likedByCurrentUser = !target.likedByCurrentUser;
    target.likedByCurrentUser = likedByCurrentUser;
    target.likeCount = likedByCurrentUser ? target.likeCount + 1 : Math.max(0, target.likeCount - 1);
    return { ...target };
  }

  const { data } = await http.post<PostDto>(`/posts/${postId}/likes`);
  return mapPost(data);
}

export async function addPostComment(postId: number, content = "Great insight!"): Promise<Post> {
  const result = await createPostComment(postId, content);
  return result.post;
}

export async function createPostComment(postId: number, content: string): Promise<{ post: Post; comment: PostComment }> {
  if (DEMO_MODE) {
    const target = demoPostsStore.find((item) => item.id === postId);
    if (!target) {
      throw new Error("Post not found.");
    }
    const newComment: PostComment = {
      id: demoNextCommentId++,
      postId,
      authorName: "You",
      authorTitle: "JobPlus Member",
      avatarUrl: "https://i.pravatar.cc/120?img=3",
      content,
      createdAt: new Date().toISOString()
    };
    const existing = demoCommentsStore[postId] ?? [];
    demoCommentsStore[postId] = [...existing, newComment];
    target.commentCount = (target.commentCount ?? 0) + 1;
    return { post: { ...target }, comment: newComment };
  }

  try {
    const { data } = await http.post<PostDto>(`/posts/${postId}/comments`, { content });
    return {
      post: mapPost(data),
      comment: {
        id: Date.now(),
        postId,
        authorName: "You",
        authorTitle: "JobPlus Member",
        avatarUrl: "https://i.pravatar.cc/120?img=3",
        content,
        createdAt: new Date().toISOString()
      }
    };
  } catch {
    const { data } = await http.get<PostDto>(`/posts/${postId}`);
    return {
      post: mapPost(data),
      comment: {
        id: Date.now(),
        postId,
        authorName: "You",
        authorTitle: "JobPlus Member",
        avatarUrl: "https://i.pravatar.cc/120?img=3",
        content,
        createdAt: new Date().toISOString()
      }
    };
  }
}

export async function listPostComments(postId: number): Promise<PostComment[]> {
  if (DEMO_MODE) {
    return (demoCommentsStore[postId] ?? []).slice();
  }
  try {
    const { data } = await http.get<PostComment[]>(`/posts/${postId}/comments`);
    return data;
  } catch {
    return [];
  }
}

export async function listPostCategories(): Promise<PostCategory[]> {
  if (DEMO_MODE) {
    return demoCategories.map((item) => ({ ...item }));
  }

  try {
    const { data } = await http.get<PostCategoryDto[]>("/post-categories");
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      createdAt: item.createdAt ?? undefined
    }));
  } catch {
    return demoCategories.map((item) => ({ ...item }));
  }
}

function mapPost(item: PostDto): Post {
  return {
    id: item.id,
    userId: item.userId,
    authorUsername: item.authorUsername,
    authorFullName: item.authorFullName,
    authorTitle: item.authorTitle ?? undefined,
    avatarUrl: item.avatarUrl ?? undefined,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    content: item.content,
    imageUrl: item.imageUrl ?? undefined,
    likeCount: item.likeCount,
    commentCount: item.commentCount ?? 0,
    likedByCurrentUser: item.likedByCurrentUser,
    createdAt: item.createdAt ?? undefined
  };
}

function getDemoPostsSorted(): Post[] {
  return demoPostsStore
    .slice()
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .map((item) => ({ ...item }));
}

function getDemoTrendingPosts(): Post[] {
  return demoPostsStore
    .slice()
    .sort((a, b) => {
      const engagementA = a.likeCount + (a.commentCount ?? 0);
      const engagementB = b.likeCount + (b.commentCount ?? 0);
      return engagementB - engagementA;
    })
    .slice(0, 8)
    .map((item) => ({ ...item }));
}

function resolveCategoryForDemo(categoryId: number | undefined, content: string): PostCategory {
  if (categoryId) {
    const exact = demoCategories.find((item) => item.id === categoryId);
    if (exact) {
      return exact;
    }
  }

  const value = content.toLowerCase();
  if (value.includes("market") || value.includes("campaign") || value.includes("brand")) {
    return demoCategories.find((item) => item.name === "Marketing") ?? demoCategories[0];
  }
  if (value.includes("tech") || value.includes("ai") || value.includes("code") || value.includes("cloud")) {
    return demoCategories.find((item) => item.name === "Technology") ?? demoCategories[0];
  }
  if (value.includes("learn") || value.includes("training") || value.includes("education")) {
    return demoCategories.find((item) => item.name === "Education") ?? demoCategories[0];
  }
  if (value.includes("strategy") || value.includes("business") || value.includes("growth")) {
    return demoCategories.find((item) => item.name === "Business Strategy") ?? demoCategories[0];
  }
  return demoCategories[0];
}

function seedDemoComments(): Record<number, PostComment[]> {
  const output: Record<number, PostComment[]> = {};
  demoPostsStore.forEach((post, index) => {
    const amount = Math.min(3, Math.max(0, post.commentCount ?? 0));
    output[post.id] = Array.from({ length: amount }).map((_, commentIndex) => {
      const author = demoCommentAuthors[(index + commentIndex) % demoCommentAuthors.length];
      const content = demoCommentTexts[(index + commentIndex) % demoCommentTexts.length];
      return {
        id: demoNextCommentId++,
        postId: post.id,
        authorName: author.name,
        authorTitle: author.title,
        avatarUrl: author.avatarUrl,
        content,
        createdAt: new Date(Date.now() - (commentIndex + 1) * 1000 * 60 * 55).toISOString()
      };
    });
  });
  return output;
}
