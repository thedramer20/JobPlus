package com.jobplus.service;

import com.jobplus.entity.PostCategory;
import com.jobplus.exception.ResourceNotFoundException;
import com.jobplus.mapper.PostCategoryMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostCategoryService {
    private final PostCategoryMapper postCategoryMapper;

    public PostCategoryService(PostCategoryMapper postCategoryMapper) {
        this.postCategoryMapper = postCategoryMapper;
    }

    public List<PostCategory> getAllCategories() {
        return postCategoryMapper.findAll();
    }

    public PostCategory requireById(Long id) {
        PostCategory category = postCategoryMapper.findById(id);
        if (category == null) {
            throw new ResourceNotFoundException("Post category not found");
        }
        return category;
    }

    public PostCategory findByName(String name) {
        return postCategoryMapper.findByName(name);
    }
}
