package com.jobplus.service;

import com.jobplus.entity.JobCategory;
import com.jobplus.mapper.JobCategoryMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobCategoryService {
    private final JobCategoryMapper jobCategoryMapper;

    public JobCategoryService(JobCategoryMapper jobCategoryMapper) {
        this.jobCategoryMapper = jobCategoryMapper;
    }

    public List<JobCategory> getAllCategories() {
        return jobCategoryMapper.findAll();
    }
}
