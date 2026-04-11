import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listPostCategories, listPosts, listTrendingPosts } from "../services/posts-service";

export function TopContentPage() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: listPosts
  });

  const { data: trendingPosts = [] } = useQuery({
    queryKey: ["posts", "trending"],
    queryFn: listTrendingPosts
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["post-categories"],
    queryFn: listPostCategories
  });

  const categoryPostCounts = useMemo(() => {
    const counts = new Map<number, number>();
    posts.forEach((post) => {
      counts.set(post.categoryId, (counts.get(post.categoryId) ?? 0) + 1);
    });
    return counts;
  }, [posts]);

  const topicCategories = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        postCount: categoryPostCounts.get(category.id) ?? 0,
        icon: getCategoryIcon(category.name)
      })),
    [categories, categoryPostCounts]
  );

  const editorPicks = useMemo(() => {
    const source = trendingPosts.length ? trendingPosts : posts;
    if (!selectedTopics.length) {
      return source.slice(0, 8);
    }
    return source.filter((post) => selectedTopics.includes(post.categoryName)).slice(0, 8);
  }, [posts, selectedTopics, trendingPosts]);

  return (
    <section className="section" id="top-content">
      <div className="container jp-top-content-root">
        <div className="jp-top-topics-block">
          <h2 className="headline jp-top-topics-title">What topics do you want to explore?</h2>
          <div className="jp-topic-pill-grid">
            {categories.map((category) => {
              const selected = selectedTopics.includes(category.name);
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`jp-topic-pill ${selected ? "is-selected" : ""}`}
                  onClick={() =>
                    setSelectedTopics((current) =>
                      current.includes(category.name)
                        ? current.filter((item) => item !== category.name)
                        : [...current, category.name]
                    )
                  }
                >
                  <span className={`jp-topic-pill-icon ${selected ? "is-selected" : ""}`} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

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

        <div className="jp-top-categories-block">
          <h3 className="jp-top-section-title">Topic Categories</h3>
          <div className="jp-category-grid">
            {topicCategories.map((category) => (
              <Link key={category.id} to={`/category/${encodeURIComponent(category.name)}`} className="jp-category-card">
                <span className="jp-category-icon" aria-hidden="true">
                  {category.icon}
                </span>
                <strong className="jp-category-name">{category.name}</strong>
                <span className="helper">{category.postCount} posts</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getCategoryIcon(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("technology")) {
    return "💻";
  }
  if (normalized.includes("market")) {
    return "📢";
  }
  if (normalized.includes("business")) {
    return "🧠";
  }
  if (normalized.includes("education")) {
    return "🎓";
  }
  if (normalized.includes("leadership")) {
    return "🎯";
  }
  if (normalized.includes("productivity")) {
    return "⏱️";
  }
  if (normalized.includes("finance")) {
    return "💰";
  }
  if (normalized.includes("communication")) {
    return "💬";
  }
  if (normalized.includes("ai")) {
    return "🤖";
  }
  if (normalized.includes("career")) {
    return "🚀";
  }
  return "✨";
}

function previewText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength).trim()}...`;
}
