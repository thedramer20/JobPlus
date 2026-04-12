import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CompanyCard } from "../components/shared/company-card";
import { JobCard } from "../components/shared/job-card";
import { SearchBar } from "../components/shared/search-bar";
import { SkeletonList } from "../components/shared/skeleton-list";
import { StatCard } from "../components/shared/stat-card";
import { listCompanies } from "../services/companies-service";
import { listJobs } from "../services/jobs-service";
import { createPost, createPostComment, listPostCategories, listPostComments, listPosts, listTrendingPosts, togglePostLike } from "../services/posts-service";
import { authStore } from "../store/auth-store";
import type { PostComment } from "../types/post";

// Topics will be dynamically generated from categories
// No static topicItems needed anymore

export function HomePage() {
  const queryClient = useQueryClient();
  const { user } = authStore();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [postForm, setPostForm] = useState({ content: "", imageUrl: "", categoryId: "" });
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentsByPost, setCommentsByPost] = useState<Record<number, PostComment[]>>({});

  // Optimize queries with better caching and stale time
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({ 
    queryKey: ["jobs", "featured"], 
    queryFn: () => listJobs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: companies = [], isLoading: companiesLoading } = useQuery({ 
    queryKey: ["companies", "featured"], 
    queryFn: listCompanies,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({ 
    queryKey: ["posts"], 
    queryFn: listPosts,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });

  const { data: trendingPosts = [], isLoading: trendingLoading } = useQuery({ 
    queryKey: ["posts", "trending"], 
    queryFn: listTrendingPosts,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const { data: categories = [] } = useQuery({ 
    queryKey: ["post-categories"], 
    queryFn: listPostCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
  });

  const categoryPostCounts = useMemo(() => {
    const counts = new Map<number, number>();
    posts.forEach((post) => {
      counts.set(post.categoryId, (counts.get(post.categoryId) ?? 0) + 1);
    });
    return counts;
  }, [posts]);

  const topicCategories = useMemo(
    () => {
      // If no categories from backend, use fake data for demo
      if (categories.length === 0) {
        const fakeCategories = [
          { id: 1, name: "Business Strategy", postCount: 24 },
          { id: 2, name: "Marketing", postCount: 18 },
          { id: 3, name: "Career Development", postCount: 32 },
          { id: 4, name: "Technology", postCount: 45 },
          { id: 5, name: "Leadership", postCount: 21 },
          { id: 6, name: "Innovation", postCount: 15 },
          { id: 7, name: "Finance", postCount: 19 },
          { id: 8, name: "Sales", postCount: 14 },
          { id: 9, name: "Corporate Social Responsibility", postCount: 8 },
          { id: 10, name: "Artificial Intelligence", postCount: 27 },
          { id: 11, name: "Recruitment & HR", postCount: 22 },
          { id: 12, name: "Workplace Trends", postCount: 16 },
          { id: 13, name: "Productivity", postCount: 29 },
          { id: 14, name: "Communication", postCount: 25 },
          { id: 15, name: "Customer Experience", postCount: 20 },
        ];
        return fakeCategories.map((category) => ({
          ...category,
          icon: getCategoryIcon(category.name)
        }));
      }

      // Use real data from backend
      return categories.map((category) => ({
        ...category,
        postCount: categoryPostCounts.get(category.id) ?? 0,
        icon: getCategoryIcon(category.name)
      }));
    },
    [categories, categoryPostCounts]
  );

  const editorPicks = useMemo(() => {
    // If no posts from backend, use fake data for demo
    if (!posts.length && !trendingPosts.length) {
      return [
        {
          id: 1,
          categoryName: "Leadership",
          content: "5 Essential Skills Every Modern Leader Needs in 2024: Emotional intelligence, adaptability, strategic thinking, effective communication, and the ability to inspire teams are crucial for success in today's rapidly changing business environment.",
          likeCount: 142,
          authorFullName: "Sarah Johnson",
          authorUsername: "sarah.j"
        },
        {
          id: 2,
          categoryName: "Technology",
          content: "How AI is Transforming the Workplace: From automating routine tasks to enhancing decision-making processes, artificial intelligence is reshaping how we work and creating new opportunities for innovation.",
          likeCount: 98,
          authorFullName: "Michael Chen",
          authorUsername: "mike.chen"
        },
        {
          id: 3,
          categoryName: "Career Development",
          content: "Building a Strong Professional Network: Quality over quantity. Focus on meaningful connections, provide value to others, and maintain relationships consistently rather than just when you need something.",
          likeCount: 76,
          authorFullName: "Emily Rodriguez",
          authorUsername: "emily.r"
        },
        {
          id: 4,
          categoryName: "Productivity",
          content: "The Power of Deep Work: Eliminate distractions, create focused work blocks, and prioritize your most important tasks. Your ability to concentrate without interruption is a valuable skill in today's distracted world.",
          likeCount: 89,
          authorFullName: "David Park",
          authorUsername: "david.p"
        }
      ];
    }

    // Use real data from backend
    const source = trendingPosts.length ? trendingPosts : posts;
    if (!selectedTopics.length) {
      return source.slice(0, 4);
    }
    return source.filter((post) => selectedTopics.includes(post.categoryName)).slice(0, 4);
  }, [posts, selectedTopics, trendingPosts, categories.length]);

  const createPostMutation = useMutation({
    mutationFn: () =>
      createPost({
        categoryId: postForm.categoryId ? Number(postForm.categoryId) : undefined,
        content: postForm.content,
        imageUrl: postForm.imageUrl || undefined
      }),
    onSuccess: () => {
      setPostForm({ content: "", imageUrl: "", categoryId: "" });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "trending"] });
    }
  });

  const likePostMutation = useMutation({
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

  const commentPostMutation = useMutation({
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
      setCommentDraft("");
      setActiveCommentPostId(null);
    }
  });

  useEffect(() => {
    let active = true;
    async function loadInitialComments() {
      const entries = await Promise.all(posts.slice(0, 6).map(async (post) => [post.id, await listPostComments(post.id)] as const));
      if (active) {
        setCommentsByPost(Object.fromEntries(entries));
      }
    }
    if (posts.length) {
      void loadInitialComments();
    }
    return () => {
      active = false;
    };
  }, [posts]);

  return (
    <div className="jp-home-root">
      <section className="section">
        <div className="container hero">
          <div className="hero-panel stack">
            <span className="pill">For ambitious candidates and growth-stage employers</span>
            <div className="stack" style={{ gap: "0.8rem" }}>
              <div className="eyebrow">
                Startup-grade hiring product
              </div>
              <h1 className="headline" style={{ fontSize: "clamp(2.8rem, 7vw, 4.8rem)", margin: 0 }}>
                Build better careers and better teams in one marketplace.
              </h1>
              <p style={{ color: "var(--text-soft)", fontSize: "1.08rem", maxWidth: "60ch" }}>
                JobPlus combines job discovery, company branding, candidate workflows, and employer hiring operations
                into a polished platform designed to scale beyond the classroom.
              </p>
            </div>
            <SearchBar />
            <div className="row" style={{ flexWrap: "wrap" }}>
              <a className="btn btn-primary" href="/register">
                Create candidate account
              </a>
              <a className="btn btn-secondary" href="/register">
                Start hiring
              </a>
            </div>
          </div>

          <div className="hero-aside stack">
            <div className="subtle-card stack">
              <div className="eyebrow">Marketplace snapshot</div>
              <div className="grid grid-2">
                <StatCard
                  label="Open roles"
                  value={jobsLoading ? "..." : String(jobs.length || 0)}
                  meta="Visible opportunities on the platform"
                />
                <StatCard
                  label="Employers"
                  value={companiesLoading ? "..." : String(companies.length || 0)}
                  meta="Companies building teams with JobPlus"
                />
              </div>
            </div>

            <div className="surface" style={{ padding: "1.3rem" }}>
              <strong>What users get</strong>
              <div className="stack" style={{ marginTop: "1rem" }}>
                <div className="card">Real-time application tracking</div>
                <div className="card">Company-first employer branding</div>
                <div className="card">Role-based dashboards for candidate, employer, and admin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="grid grid-4">
            <StatCard label="Candidate-first" value="Faster" meta="Apply, track, and manage your search in one place" />
            <StatCard label="Employer tools" value="Cleaner" meta="Structured posting, applicants, and pipeline views" />
            <StatCard label="Admin ready" value="Safer" meta="Moderation, management, and data oversight support" />
            <StatCard label="Production path" value="Scalable" meta="React frontend with Spring Boot backend integration" />
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container stack" style={{ gap: "1rem" }}>
          <div className="space-between">
            <div>
              <div className="eyebrow">Main Feed</div>
              <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 0" }}>
                Real posts now drive your content experience.
              </h2>
            </div>
          </div>

          {user ? (
            <div className="surface jp-post-composer">
              <div className="space-between" style={{ alignItems: "center" }}>
                <strong>Create a post</strong>
                <span className="helper">Posts appear in the feed and inside Top Content automatically.</span>
              </div>
              <div className="form-grid">
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Post content</label>
                  <textarea
                    className="textarea"
                    value={postForm.content}
                    onChange={(event) => setPostForm((current) => ({ ...current, content: event.target.value }))}
                    placeholder="Share an idea, insight, or update with your network..."
                  />
                </div>
                <div className="field">
                  <label>Category</label>
                  <select
                    className="select"
                    value={postForm.categoryId}
                    onChange={(event) => setPostForm((current) => ({ ...current, categoryId: event.target.value }))}
                  >
                    <option value="">Auto-detect category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Image URL</label>
                  <input
                    className="input"
                    value={postForm.imageUrl}
                    onChange={(event) => setPostForm((current) => ({ ...current, imageUrl: event.target.value }))}
                    placeholder="Optional image URL"
                  />
                </div>
              </div>
              <div className="space-between">
                <span className="helper">Use a category or let the backend detect one from your text.</span>
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={!postForm.content.trim() || createPostMutation.isPending}
                  onClick={() => createPostMutation.mutate()}
                >
                  {createPostMutation.isPending ? "Posting..." : "Publish post"}
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-note">Log in to create posts. Public visitors can still browse the live feed and Top Content.</div>
          )}

          <div className="grid grid-2">
            {postsLoading || trendingLoading ? (
              <div style={{ gridColumn: "1 / -1" }}>
                <SkeletonList count={2} />
              </div>
            ) : posts.length ? (
              posts.slice(0, 4).map((post) => (
                <article key={post.id} className="jp-feed-card">
                  {post.imageUrl ? <img src={post.imageUrl} alt={post.categoryName} className="jp-feed-image" /> : null}
                  <div className="stack" style={{ gap: "0.75rem" }}>
                    <div className="space-between" style={{ alignItems: "flex-start" }}>
                      <Link
                        to={`/profile/${encodeURIComponent(post.authorUsername)}`}
                        className="row"
                        style={{ alignItems: "center", gap: "0.7rem", textDecoration: "none", color: "inherit" }}
                      >
                        <img
                          src={post.avatarUrl || "https://i.pravatar.cc/120?img=2"}
                          alt={post.authorFullName}
                          style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div className="stack" style={{ gap: "0.1rem" }}>
                          <strong>{post.authorFullName}</strong>
                          <span className="helper">{post.authorTitle || `@${post.authorUsername}`}</span>
                        </div>
                      </Link>
                      <span className="tag">{post.categoryName}</span>
                    </div>
                    <p style={{ margin: 0, color: "var(--text-soft)", lineHeight: 1.7 }}>{post.content}</p>
                    <div className="row" style={{ gap: "0.6rem" }}>
                      <button
                        type="button"
                        className={`jp-like-button ${post.likedByCurrentUser ? "is-active" : ""}`}
                        onClick={() => likePostMutation.mutate(post.id)}
                        disabled={!user || likePostMutation.isPending}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill={post.likedByCurrentUser ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6.72-4.35-9.2-8.23C.64 9.4 2.1 5.25 6.08 4.32c2.07-.48 4.14.3 5.42 2.02 1.28-1.72 3.35-2.5 5.42-2.02 3.98.93 5.44 5.08 3.28 8.45C18.72 16.65 12 21 12 21z" />
                        </svg>
                        {post.likeCount} likes
                      </button>
                      <button
                        type="button"
                        className="jp-like-button"
                        onClick={() => setActiveCommentPostId((current) => (current === post.id ? null : post.id))}
                        disabled={!user}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {post.commentCount ?? 0} comments
                      </button>
                    </div>
                    {activeCommentPostId === post.id ? (
                      <div className="stack" style={{ gap: "0.5rem" }}>
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
                        <textarea
                          className="textarea"
                          style={{ minHeight: "86px" }}
                          placeholder="Write a comment..."
                          value={commentDraft}
                          onChange={(event) => setCommentDraft(event.target.value)}
                        />
                        <div className="row" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
                          <button className="btn btn-secondary" type="button" onClick={() => setActiveCommentPostId(null)}>
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled={!commentDraft.trim() || commentPostMutation.isPending}
                            onClick={() => commentPostMutation.mutate({ postId: post.id, content: commentDraft })}
                          >
                            {commentPostMutation.isPending ? "Posting..." : "Post comment"}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
                No posts yet. Create the first post to make the feed and Top Content feel alive.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="top-content">
        <div className="container jp-top-content-root">
          {/* Section 1: What topics do you want to explore? */}
          <div className="jp-top-topics-block">
            <h2 className="headline jp-top-topics-title">What topics do you want to explore?</h2>
            <div className="jp-topic-pill-grid">
              {categories.map((category) => {
                const selected = selectedTopics.includes(category.name);
                return (
                  <Link
                    key={category.id}
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className={`jp-topic-pill ${selected ? "is-selected" : ""}`}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        setSelectedTopics((current) =>
                          current.includes(category.name) 
                            ? current.filter((item) => item !== category.name)
                            : [...current, category.name]
                        );
                        setTimeout(() => {
                          window.location.href = `/category/${encodeURIComponent(category.name)}`;
                        }, 150);
                      }
                    }}
                  >
                    <span className={`jp-topic-pill-icon ${selected ? "is-selected" : ""}`} aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2: Editor's Picks */}
          <div className="jp-top-editors-block">
            <h3 className="jp-top-section-title">Editor&apos;s Picks</h3>
            <p className="helper jp-top-section-subtitle">Handpicked ideas and insights from professionals</p>
            <div className="jp-editor-grid">
              {editorPicks.length ? (
                editorPicks.map((post) => (
                  <Link
                    key={post.id}
                    to={`/category/${encodeURIComponent(post.categoryName)}`}
                    className="jp-editor-card"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="space-between" style={{ alignItems: "flex-start" }}>
                      <span className="tag">{post.categoryName}</span>
                      <span className="jp-editor-card-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
                        </svg>
                      </span>
                    </div>
                    <h4 className="jp-editor-card-title">{previewText(post.content, 72)}</h4>
                    <div className="space-between" style={{ marginTop: "auto", alignItems: "center" }}>
                      <span className="helper" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                          <path d="M12 21s-6.72-4.35-9.2-8.23C.64 9.4 2.1 5.25 6.08 4.32c2.07-.48 4.14.3 5.42 2.02 1.28-1.72 3.35-2.5 5.42-2.02 3.98.93 5.44 5.08 3.28 8.45C18.72 16.65 12 21 12 21z" />
                        </svg>
                        {post.likeCount} likes
                      </span>
                      <button type="button" className="jp-save-button" aria-label="Save editor pick" onClick={(e) => e.preventDefault()}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4.75h10A1.25 1.25 0 0 1 18.25 6v14l-6.25-3-6.25 3V6A1.25 1.25 0 0 1 7 4.75Z" />
                        </svg>
                      </button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
                  No posts yet. Publish a post to start filling Editor&apos;s Picks.
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Topic Categories */}
          <div className="jp-top-categories-block">
            <h3 className="jp-top-section-title">Topic Categories</h3>
            <div className="jp-category-grid">
              {topicCategories.map((category) => {
                const selected = selectedTopics.includes(category.name);
                return (
                  <Link
                    key={category.id}
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className={`jp-category-card ${selected ? "is-active" : ""}`}
                    onClick={(e) => {
                      // Allow Ctrl/Cmd+click to open in new tab
                      if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        setSelectedTopics((current) =>
                          current.includes(category.name)
                            ? current.filter((item) => item !== category.name)
                            : [...current, category.name]
                        );
                        // Navigate after a short delay to show selection
                        setTimeout(() => {
                          window.location.href = `/category/${encodeURIComponent(category.name)}`;
                        }, 150);
                      }
                    }}
                  >
                    <span className="jp-category-icon" aria-hidden="true">
                      {category.icon}
                    </span>
                    <strong className="jp-category-name">{category.name}</strong>
                    <span className="helper">{category.postCount} posts</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <div className="space-between">
            <div>
              <div className="eyebrow">Featured jobs</div>
              <h2 className="headline" style={{ fontSize: "2.3rem", margin: "0.35rem 0 0" }}>
                The marketplace should feel alive from day one.
              </h2>
            </div>
            <a className="btn btn-secondary" href="/jobs">
              Browse all jobs
            </a>
          </div>
          <div className="grid grid-3">
            {jobsLoading ? (
              <div style={{ gridColumn: "1 / -1" }}>
                <SkeletonList count={3} />
              </div>
            ) : (
              jobs.slice(0, 3).map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3">
          <div className="surface" style={{ padding: "1.4rem" }}>
            <div className="eyebrow">How it works</div>
            <h3>For candidates</h3>
            <p className="helper">Build profile, save jobs, apply faster, and track your status with less confusion.</p>
          </div>
          <div className="surface" style={{ padding: "1.4rem" }}>
            <div className="eyebrow">How it works</div>
            <h3>For employers</h3>
            <p className="helper">Create company presence, publish roles, and move applicants through a cleaner workflow.</p>
          </div>
          <div className="surface" style={{ padding: "1.4rem" }}>
            <div className="eyebrow">How it works</div>
            <h3>For admins</h3>
            <p className="helper">Monitor marketplace health, manage entities, and support moderation with structured data views.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <div>
            <div className="eyebrow">Employer branding</div>
            <h2 className="headline" style={{ fontSize: "2.3rem", margin: "0.35rem 0 0.7rem" }}>
              Modern companies need more than a plain list of vacancies.
            </h2>
            <p className="helper" style={{ maxWidth: "70ch" }}>
              JobPlus gives employers a company presence, hiring dashboard, job performance overview, and applicant flow
              management that feels closer to real SaaS software than a class assignment.
            </p>
          </div>
          <div className="grid grid-2">
            {companiesLoading ? (
              <div style={{ gridColumn: "1 / -1" }}>
                <SkeletonList count={2} />
              </div>
            ) : (
              companies.slice(0, 2).map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container surface" style={{ padding: "2rem" }}>
          <div className="space-between">
            <div>
              <div className="eyebrow">Ready to get started?</div>
              <h2 className="headline" style={{ fontSize: "2.2rem", margin: "0.35rem 0 0" }}>
                Join JobPlus as a candidate or as a hiring team.
              </h2>
            </div>
            <div className="row">
              <a className="btn btn-primary" href="/register">
                Sign up
              </a>
              <a className="btn btn-secondary" href="/about">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryIcon(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("technology")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8 4 12l4 4M16 8l4 4-4 4M14 5l-4 14" />
      </svg>
    );
  }
  if (normalized.includes("change")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h10M7 17h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l2 2 3-4" />
      </svg>
    );
  }
  if (normalized.includes("employee")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19a4.5 4.5 0 0 1 9 0M14 19a3.5 3.5 0 0 1 7 0" />
      </svg>
    );
  }
  if (normalized.includes("economics") || normalized.includes("finance")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 17 9 13l3 3 7-8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 19H5" />
      </svg>
    );
  }
  if (normalized.includes("consult")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v7.5A1.75 1.75 0 0 1 18.25 16H12l-4 3v-3H5.75A1.75 1.75 0 0 1 4 14.25v-7.5Z" />
      </svg>
    );
  }
  if (normalized.includes("writing")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 20 4.5-1.2L19 8.3 15.7 5 5.2 15.5 4 20Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 7.2 16.8 10.5" />
      </svg>
    );
  }
  if (normalized.includes("hospitality") || normalized.includes("tourism")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17h18M6 17v-6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9V6h8v3" />
      </svg>
    );
  }
  if (normalized.includes("network")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 18a4 4 0 0 1 8 0M12 18a4.5 4.5 0 0 1 9 0" />
      </svg>
    );
  }
  if (normalized.includes("ecommerce")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 6h14l-1.2 6.5H6.2L5 6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 6 4 4H2" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    );
  }
  if (normalized.includes("user experience")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 9l8 12 8-12-8-6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 11h7" />
      </svg>
    );
  }
  if (normalized.includes("soft skills") || normalized.includes("emotional")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20s-5.5-3.7-7.6-6.9C2.6 10.4 4.1 6.8 7.5 6.2c1.8-.3 3.5.4 4.5 1.8 1-1.4 2.7-2.1 4.5-1.8 3.4.6 4.9 4.2 3.1 6.9C17.5 16.3 12 20 12 20Z" />
      </svg>
    );
  }
  if (normalized.includes("productivity")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v8l5 3" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    );
  }
  if (normalized.includes("project")) {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h11M8 12h11M8 18h11M4 6h.01M4 12h.01M4 18h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.7 5.47 6.04.88-4.37 4.26 1.03 6.02L12 16.8l-5.4 2.83 1.03-6.02L3.26 9.35l6.04-.88L12 3z" />
    </svg>
  );
}

function previewText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength).trim()}...`;
}
