package com.jobplus.controller;

import com.jobplus.entity.JobCategory;
import com.jobplus.service.JobCategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/job-categories")
public class JobCategoryController {
    private final JobCategoryService jobCategoryService;

    public JobCategoryController(JobCategoryService jobCategoryService) {
        this.jobCategoryService = jobCategoryService;
    }

    @GetMapping
    public List<JobCategory> getAllCategories() {
        return jobCategoryService.getAllCategories();
    }
}
