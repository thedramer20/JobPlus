package com.jobplus.controller;

import com.jobplus.entity.PostCategory;
import com.jobplus.service.PostCategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/post-categories")
public class PostCategoryController {
    private final PostCategoryService postCategoryService;

    public PostCategoryController(PostCategoryService postCategoryService) {
        this.postCategoryService = postCategoryService;
    }

    @GetMapping
    public List<PostCategory> getAllCategories() {
        return postCategoryService.getAllCategories();
    }
}
