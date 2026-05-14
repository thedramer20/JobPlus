package com.jobplus.service;

import com.jobplus.dto.AdminOverviewResponse;
import com.jobplus.dto.CompanyResponse;
import com.jobplus.dto.JobResponse;
import com.jobplus.dto.UserProfileResponse;
import com.jobplus.entity.Company;
import com.jobplus.entity.Job;
import com.jobplus.entity.User;
import com.jobplus.exception.ForbiddenOperationException;
import com.jobplus.mapper.CompanyMapper;
import com.jobplus.mapper.JobMapper;
import com.jobplus.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final UserMapper userMapper;
    private final CompanyMapper companyMapper;
    private final JobMapper jobMapper;
    private final UserService userService;

    public AdminService(UserMapper userMapper, CompanyMapper companyMapper, JobMapper jobMapper, UserService userService) {
        this.userMapper = userMapper;
        this.companyMapper = companyMapper;
        this.jobMapper = jobMapper;
        this.userService = userService;
    }

    public AdminOverviewResponse getOverview(String username) {
        requireAdmin(username);
        AdminOverviewResponse response = new AdminOverviewResponse();
        response.setUsersCount(userMapper.countAll());
        response.setCompaniesCount(companyMapper.findAll().size());
        response.setJobsCount(jobMapper.findAll().size());
        response.setOpenJobsCount(jobMapper.findAllOpenJobs().size());
        return response;
    }

    public List<UserProfileResponse> getUsers(String username) {
        requireAdmin(username);
        return userMapper.findAll().stream().map(this::toUserResponse).collect(Collectors.toList());
    }

    public List<CompanyResponse> getCompanies(String username) {
        requireAdmin(username);
        return companyMapper.findAll().stream().map(this::toCompanyResponse).collect(Collectors.toList());
    }

    public List<JobResponse> getJobs(String username) {
        requireAdmin(username);
        return jobMapper.findAll().stream().map(this::toJobResponse).collect(Collectors.toList());
    }

    private void requireAdmin(String username) {
        User user = userService.getUserByUsername(username);
        if (!"ROLE_ADMIN".equals(user.getRole())) {
            throw new ForbiddenOperationException("Only admins can access this endpoint");
        }
    }

    private UserProfileResponse toUserResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        return response;
    }

    private CompanyResponse toCompanyResponse(Company company) {
        CompanyResponse response = new CompanyResponse();
        response.setId(company.getId());
        response.setOwnerUserId(company.getOwnerUserId());
        response.setOwnerUsername(company.getOwnerUsername());
        response.setCompanyName(company.getCompanyName());
        response.setDescription(company.getDescription());
        response.setIndustry(company.getIndustry());
        response.setLocation(company.getLocation());
        response.setWebsite(company.getWebsite());
        response.setLogoUrl(company.getLogoUrl());
        response.setCompanySize(company.getCompanySize());
        response.setStatus(company.getStatus());
        return response;
    }

    private JobResponse toJobResponse(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setCompanyId(job.getCompanyId());
        response.setCompanyName(job.getCompanyName());
        response.setCategoryId(job.getCategoryId());
        response.setCategoryName(job.getCategoryName());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setRequirements(job.getRequirements());
        response.setLocation(job.getLocation());
        response.setJobType(job.getJobType());
        response.setWorkMode(job.getWorkMode());
        response.setExperienceLevel(job.getExperienceLevel());
        response.setSalaryMin(job.getSalaryMin());
        response.setSalaryMax(job.getSalaryMax());
        response.setCurrency(job.getCurrency());
        response.setVacancyCount(job.getVacancyCount());
        response.setApplicationDeadline(job.getApplicationDeadline());
        response.setStatus(job.getStatus());
        return response;
    }
}
