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
          content: "5 Essential Skills Every Modern Leader Needs in 2024: Emotional intelligence, adaptability, strategic thinking, effective communication, and ability to inspire teams are crucial for success in today's rapidly changing business environment.",
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

    const source = trendingPosts.length ? trendingPosts : posts;
    if (!selectedTopics.length) {
      return source.slice(0, 8);
    }
    return source.filter((post) => selectedTopics.includes(post.categoryName)).slice(0, 8);
  }, [posts, selectedTopics, trendingPosts, categories.length]);

  return (
    <section className="section" id="top-content">
      <div className="container jp-top-content-root">
        {/* Section 1: What topics do you want to explore? */}
        <div className="jp-top-topics-block">
          <h2 className="headline jp-top-topics-title">What topics do you want to explore?</h2>
          <div className="jp-topic-pill-grid">
            {topicCategories.map((category) => {
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
                    {category.icon}
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
  if (normalized.includes("sales")) {
    return "📊";
  }
  if (normalized.includes("innovation")) {
    return "💡";
  }
  if (normalized.includes("customer")) {
    return "👥";
  }
  if (normalized.includes("corporate")) {
    return "🏢";
  }
  if (normalized.includes("recruitment")) {
    return "👥";
  }
  if (normalized.includes("workplace")) {
    return "🏢";
  }
  return "✨";
}

function previewText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength).trim()}...`;
}
