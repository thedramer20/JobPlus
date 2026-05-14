package com.jobplus.controller;

import com.jobplus.dto.ApplicationCreateRequest;
import com.jobplus.dto.ApplicationResponse;
import com.jobplus.dto.ApplicationStatusUpdateRequest;
import com.jobplus.service.ApplicationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ApplicationResponse apply(@RequestBody ApplicationCreateRequest request, Authentication authentication) {
        return applicationService.apply(authentication.getName(), request);
    }

    @GetMapping("/me")
    public List<ApplicationResponse> getMyApplications(Authentication authentication) {
        return applicationService.getMyApplications(authentication.getName());
    }

    @GetMapping("/jobs/{jobId}")
    public List<ApplicationResponse> getApplicationsByJob(@PathVariable Long jobId, Authentication authentication) {
        return applicationService.getApplicationsByJob(authentication.getName(), jobId);
    }

    @PatchMapping("/{id}/status")
    public ApplicationResponse updateApplicationStatus(@PathVariable Long id,
                                                       @RequestBody ApplicationStatusUpdateRequest request,
                                                       Authentication authentication) {
        return applicationService.updateApplicationStatus(authentication.getName(), id, request);
    }
}
