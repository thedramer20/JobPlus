package com.jobplus.controller;

import com.jobplus.dto.PostCreateRequest;
import com.jobplus.dto.PostResponse;
import com.jobplus.service.PostService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<PostResponse> getFeed(Authentication authentication) {
        return postService.getFeed(authentication == null ? null : authentication.getName());
    }

    @GetMapping("/trending")
    public List<PostResponse> getTrending(Authentication authentication) {
        return postService.getTrending(authentication == null ? null : authentication.getName());
    }

    @PostMapping
    public PostResponse createPost(@RequestBody PostCreateRequest request, Authentication authentication) {
        return postService.createPost(authentication.getName(), request);
    }

    @PostMapping("/{id}/likes")
    public PostResponse toggleLike(@PathVariable Long id, Authentication authentication) {
        return postService.toggleLike(id, authentication.getName());
    }
}
