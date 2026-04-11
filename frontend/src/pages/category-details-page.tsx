import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmptyState } from "../components/shared/empty-state";
import PostEngagementBar from "../components/shared/post-engagement-bar";
import { createPostComment, listPostCategories, listPostComments, listPosts, togglePostLike } from "../services/posts-service";
import type { PostComment } from "../types/post";

export function CategoryDetailsPage() {
  const queryClient = useQueryClient();
  const { categoryName } = useParams<{ categoryName: string }>();
  const normalizedCategory = decodeURIComponent(categoryName ?? "").trim().toLowerCase();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: listPosts
  });
  const [commentsByPost, setCommentsByPost] = useState<Record<number, PostComment[]>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["post-categories"],
    queryFn: listPostCategories
  });

  const categoryPosts = useMemo(
    () => posts.filter((post) => post.categoryName?.toLowerCase() === normalizedCategory),
    [posts, normalizedCategory]
  );

  const currentCategory = useMemo(
    () => categories.find((category) => category.name?.toLowerCase() === normalizedCategory),
    [categories, normalizedCategory]
  );

  const otherCategories = useMemo(
    () => categories.filter((category) => category.name?.toLowerCase() !== normalizedCategory).slice(0, 10),
    [categories, normalizedCategory]
  );

  const likeMutation = useMutation({
    mutationFn: (postId: number) => togglePostLike(postId),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["posts"], (current: typeof posts | undefined) =>
        (current ?? []).map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
      queryClient.setQueryData(["posts", "trending"], (current: typeof posts | undefined) =>
        (current ?? []).map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
    }
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: number; content: string }) => createPostComment(postId, content),
    onSuccess: ({ post: updatedPost, comment }) => {
      queryClient.setQueryData(["posts"], (current: typeof posts | undefined) =>
        (current ?? []).map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
      queryClient.setQueryData(["posts", "trending"], (current: typeof posts | undefined) =>
        (current ?? []).map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
      setCommentsByPost((current) => ({
        ...current,
        [updatedPost.id]: [...(current[updatedPost.id] ?? []), comment]
      }));
    }
  });

  useEffect(() => {
    let active = true;
    async function loadComments() {
      const entries = await Promise.all(
        categoryPosts.map(async (post) => [post.id, await listPostComments(post.id)] as const)
      );
      if (active) {
        setCommentsByPost(Object.fromEntries(entries));
      }
    }
    if (categoryPosts.length) {
      void loadComments();
    }
    return () => {
      active = false;
    };
  }, [categoryPosts]);

  if (!categoryName) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState title="Category not found" description="Please open a valid category from Top Content." />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container stack">
        <div className="helper">
          <Link to="/">Home</Link> | <Link to="/top-content">Top Content</Link> | {decodeURIComponent(categoryName)}
        </div>

        <div className="surface" style={{ padding: "1.4rem" }}>
          <div className="eyebrow">Category</div>
          <h1 className="headline" style={{ margin: "0.35rem 0 0.45rem", fontSize: "2.3rem" }}>
            {decodeURIComponent(categoryName)}
          </h1>
          <p className="helper" style={{ margin: 0 }}>
            {currentCategory?.description || `Explore recent posts and engagement in ${decodeURIComponent(categoryName)}.`}
          </p>
        </div>

        <div className="detail-layout">
          <div className="stack">
            {isLoading ? (
              <div className="surface" style={{ padding: "1.4rem" }}>
                Loading category content...
              </div>
            ) : null}

            {!isLoading && categoryPosts.length === 0 ? (
              <EmptyState
                title="No posts in this category yet"
                description="When people publish posts in this category, they will appear here."
              />
            ) : null}

            {!isLoading
              ? categoryPosts.map((post) => (
                <article key={post.id} className="card stack">
                    <div className="space-between" style={{ alignItems: "flex-start" }}>
                      <Link
                        to={`/profile/${encodeURIComponent(post.authorUsername)}`}
                        className="row"
                        style={{ alignItems: "center", gap: "0.7rem", textDecoration: "none", color: "inherit" }}
                      >
                        <img
                          src={post.avatarUrl || "https://i.pravatar.cc/120?img=2"}
                          alt={post.authorFullName}
                          style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <strong>{post.authorFullName}</strong>
                          <div className="helper">{post.authorTitle || `@${post.authorUsername}`}</div>
                        </div>
                      </Link>
                      <span className="tag">{post.categoryName}</span>
                    </div>

                    <p style={{ margin: 0, lineHeight: 1.7 }}>{post.content}</p>

                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.categoryName}
                        style={{ width: "100%", borderRadius: "14px", objectFit: "cover", maxHeight: "380px" }}
                      />
                    ) : null}

                    <PostEngagementBar
                      likes={post.likeCount}
                      comments={post.commentCount ?? 0}
                      userReaction={post.likedByCurrentUser ? "like" : null}
                      onLikeClick={() => likeMutation.mutate(post.id)}
                      onCommentSubmit={(content) => commentMutation.mutate({ postId: post.id, content })}
                      commentsOpen={activeCommentPostId === post.id}
                      onCommentToggle={(nextOpen) => setActiveCommentPostId(nextOpen ? post.id : null)}
                      isBusy={likeMutation.isPending || commentMutation.isPending}
                    />
                    {activeCommentPostId === post.id && (commentsByPost[post.id] ?? []).length ? (
                      <div className="stack" style={{ gap: "0.55rem" }}>
                        {(commentsByPost[post.id] ?? []).slice(-3).map((comment) => (
                          <div key={comment.id} className="row" style={{ alignItems: "flex-start", gap: "0.55rem" }}>
                            <Link
                              to={`/profile/${encodeURIComponent(comment.authorName.toLowerCase().replace(/\s+/g, "."))}`}
                              style={{ display: "inline-flex" }}
                            >
                              <img src={comment.avatarUrl} alt={comment.authorName} style={{ width: 28, height: 28, borderRadius: "50%" }} />
                            </Link>
                            <div className="surface" style={{ padding: "0.55rem 0.7rem", borderRadius: "12px", boxShadow: "none" }}>
                              <strong style={{ fontSize: "0.86rem" }}>{comment.authorName}</strong>
                              <div className="helper" style={{ fontSize: "0.75rem" }}>{comment.authorTitle}</div>
                              <div style={{ fontSize: "0.86rem", marginTop: "0.2rem" }}>{comment.content}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))
              : null}
          </div>

          <aside className="surface jp-detail-sidebar">
            <div className="stack">
              <strong>Explore categories</strong>
              <div className="row" style={{ flexWrap: "wrap" }}>
                {otherCategories.length ? (
                  otherCategories.map((category) => (
                    <Link key={category.id} to={`/category/${encodeURIComponent(category.name)}`} className="tag">
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <span className="helper">No categories available.</span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
