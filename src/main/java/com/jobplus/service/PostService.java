package com.jobplus.service;

import com.jobplus.dto.PostCreateRequest;
import com.jobplus.dto.PostResponse;
import com.jobplus.entity.Post;
import com.jobplus.entity.PostCategory;
import com.jobplus.entity.User;
import com.jobplus.exception.ResourceNotFoundException;
import com.jobplus.mapper.PostMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostMapper postMapper;
    private final UserService userService;
    private final PostCategoryService postCategoryService;

    public PostService(PostMapper postMapper, UserService userService, PostCategoryService postCategoryService) {
        this.postMapper = postMapper;
        this.userService = userService;
        this.postCategoryService = postCategoryService;
    }

    public List<PostResponse> getFeed(String username) {
        Long currentUserId = resolveUserId(username);
        return postMapper.findAllFeed().stream()
            .map(post -> toResponse(post, currentUserId))
            .collect(Collectors.toList());
    }

    public List<PostResponse> getTrending(String username) {
        Long currentUserId = resolveUserId(username);
        return postMapper.findTrending().stream()
            .map(post -> toResponse(post, currentUserId))
            .collect(Collectors.toList());
    }

    public PostResponse createPost(String username, PostCreateRequest request) {
        User user = userService.getUserByUsername(username);
        PostCategory category = resolveCategory(request);

        Post post = new Post();
        post.setUserId(user.getId());
        post.setCategoryId(category.getId());
        post.setContent(requireText(request.getContent(), "Post content is required"));
        post.setImageUrl(blankToNull(request.getImageUrl()));
        postMapper.insert(post);
        return getPostById(post.getId(), username);
    }

    public PostResponse toggleLike(Long postId, String username) {
        User user = userService.getUserByUsername(username);
        Post existing = requirePost(postId);

        if (postMapper.isLikedByUser(postId, user.getId())) {
            postMapper.deleteLike(postId, user.getId());
        } else {
            postMapper.insertLike(postId, user.getId());
        }

        return getPostById(existing.getId(), username);
    }

    public PostResponse getPostById(Long postId, String username) {
        return toResponse(requirePost(postId), resolveUserId(username));
    }

    private Post requirePost(Long postId) {
        Post post = postMapper.findById(postId);
        if (post == null) {
            throw new ResourceNotFoundException("Post not found");
        }
        return post;
    }

    private PostCategory resolveCategory(PostCreateRequest request) {
        if (request.getCategoryId() != null) {
            return postCategoryService.requireById(request.getCategoryId());
        }

        String detectedName = autoDetectCategoryName(request.getContent());
        PostCategory category = postCategoryService.findByName(detectedName);
        if (category == null) {
            throw new ResourceNotFoundException("Post category not found");
        }
        return category;
    }

    private String autoDetectCategoryName(String content) {
        String normalized = content == null ? "" : content.toLowerCase(Locale.ROOT);

        if (containsAny(normalized, "ai", "software", "technology", "engineering", "code", "developer")) {
            return "Technology";
        }
        if (containsAny(normalized, "change", "adoption", "transition", "transformation")) {
            return "Change Management";
        }
        if (containsAny(normalized, "employee", "culture", "engagement", "wellbeing", "well-being", "people")) {
            return "Employee Experience";
        }
        if (containsAny(normalized, "economy", "economic", "market", "policy", "growth")) {
            return "Economics";
        }
        if (containsAny(normalized, "consult", "client", "advisory", "framework")) {
            return "Consulting";
        }
        if (containsAny(normalized, "write", "writing", "story", "content", "article")) {
            return "Writing";
        }
        if (containsAny(normalized, "hotel", "tourism", "travel", "hospitality", "guest")) {
            return "Hospitality & Tourism";
        }
        if (containsAny(normalized, "network", "mentor", "community", "connection", "relationship", "profile")) {
            return "Networking";
        }
        if (containsAny(normalized, "ecommerce", "e-commerce", "storefront", "conversion", "customer")) {
            return "Ecommerce";
        }
        if (containsAny(normalized, "ux", "user experience", "usability", "research", "interface")) {
            return "User Experience";
        }
        if (containsAny(normalized, "empathy", "communication", "resilience", "emotional", "soft skill")) {
            return "Soft Skills & Emotional Intelligence";
        }
        if (containsAny(normalized, "productivity", "focus", "priority", "workflow", "planning")) {
            return "Productivity";
        }
        if (containsAny(normalized, "finance", "budget", "investment", "revenue", "cost")) {
            return "Finance";
        }
        if (containsAny(normalized, "project", "delivery", "roadmap", "milestone", "scope")) {
            return "Project Management";
        }
        return "Technology";
    }

    private boolean containsAny(String value, String... keywords) {
        for (String keyword : keywords) {
            if (value.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private PostResponse toResponse(Post post, Long currentUserId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setUserId(post.getUserId());
        response.setAuthorUsername(post.getAuthorUsername());
        response.setAuthorFullName(post.getAuthorFullName());
        response.setCategoryId(post.getCategoryId());
        response.setCategoryName(post.getCategoryName());
        response.setContent(post.getContent());
        response.setImageUrl(post.getImageUrl());
        response.setLikeCount(post.getLikeCount() == null ? 0 : post.getLikeCount());
        response.setLikedByCurrentUser(currentUserId != null && postMapper.isLikedByUser(post.getId(), currentUserId));
        response.setCreatedAt(post.getCreatedAt());
        return response;
    }

    private Long resolveUserId(String username) {
        if (username == null || username.isBlank()) {
            return null;
        }
        try {
            return userService.getUserByUsername(username).getId();
        } catch (Exception ignored) {
            return null;
        }
    }

    private String requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
