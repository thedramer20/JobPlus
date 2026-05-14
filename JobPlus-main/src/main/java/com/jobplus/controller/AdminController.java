package com.jobplus.controller;

import com.jobplus.dto.AdminOverviewResponse;
import com.jobplus.dto.CompanyResponse;
import com.jobplus.dto.JobResponse;
import com.jobplus.dto.UserProfileResponse;
import com.jobplus.service.AdminService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/overview")
    public AdminOverviewResponse getOverview(Authentication authentication) {
        return adminService.getOverview(authentication.getName());
    }

    @GetMapping("/users")
    public List<UserProfileResponse> getUsers(Authentication authentication) {
        return adminService.getUsers(authentication.getName());
    }

    @GetMapping("/companies")
    public List<CompanyResponse> getCompanies(Authentication authentication) {
        return adminService.getCompanies(authentication.getName());
    }

    @GetMapping("/jobs")
    public List<JobResponse> getJobs(Authentication authentication) {
        return adminService.getJobs(authentication.getName());
    }
}
