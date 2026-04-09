package com.jobplus.controller;

import com.jobplus.dto.JobCreateRequest;
import com.jobplus.dto.JobResponse;
import com.jobplus.dto.JobStatusUpdateRequest;
import com.jobplus.dto.JobUpdateRequest;
import com.jobplus.service.JobService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {
    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<JobResponse> getOpenJobs() {
        return jobService.getOpenJobs();
    }

    @GetMapping("/{id}")
    public JobResponse getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @GetMapping("/my-company")
    public List<JobResponse> getMyCompanyJobs(Authentication authentication) {
        return jobService.getMyCompanyJobs(authentication.getName());
    }

    @PostMapping
    public JobResponse createJob(@RequestBody JobCreateRequest request, Authentication authentication) {
        return jobService.createJob(authentication.getName(), request);
    }

    @PutMapping("/{id}")
    public JobResponse updateJob(@PathVariable Long id,
                                 @RequestBody JobUpdateRequest request,
                                 Authentication authentication) {
        return jobService.updateJob(authentication.getName(), id, request);
    }

    @PatchMapping("/{id}/status")
    public JobResponse updateJobStatus(@PathVariable Long id,
                                       @RequestBody JobStatusUpdateRequest request,
                                       Authentication authentication) {
        return jobService.updateJobStatus(authentication.getName(), id, request);
    }
}
