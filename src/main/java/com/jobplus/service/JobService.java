package com.jobplus.service;

import com.jobplus.dto.JobCreateRequest;
import com.jobplus.dto.JobResponse;
import com.jobplus.dto.JobStatusUpdateRequest;
import com.jobplus.dto.JobUpdateRequest;
import com.jobplus.entity.Company;
import com.jobplus.entity.Job;
import com.jobplus.entity.User;
import com.jobplus.exception.ForbiddenOperationException;
import com.jobplus.exception.ResourceNotFoundException;
import com.jobplus.mapper.JobCategoryMapper;
import com.jobplus.mapper.JobMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {
    private final JobMapper jobMapper;
    private final JobCategoryMapper jobCategoryMapper;
    private final CompanyService companyService;
    private final UserService userService;

    public JobService(JobMapper jobMapper,
                      JobCategoryMapper jobCategoryMapper,
                      CompanyService companyService,
                      UserService userService) {
        this.jobMapper = jobMapper;
        this.jobCategoryMapper = jobCategoryMapper;
        this.companyService = companyService;
        this.userService = userService;
    }

    public List<JobResponse> getOpenJobs(String query,
                                         List<String> jobTypes,
                                         List<String> experienceLevels,
                                         List<String> locations,
                                         List<String> companies,
                                         List<String> workModes,
                                         Integer minSalary) {
        return jobMapper.findOpenJobsFiltered(
            blankToNull(query),
            normalizeEnumList(jobTypes),
            normalizeEnumList(experienceLevels),
            trimList(locations),
            trimList(companies),
            normalizeWorkModes(workModes),
            minSalary
        ).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        return toResponse(requireJob(id));
    }

    public List<JobResponse> getMyCompanyJobs(String username) {
        Company company = companyService.requireOwnedCompany(username);
        return jobMapper.findByCompanyId(company.getId()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public JobResponse createJob(String username, JobCreateRequest request) {
        User user = userService.getUserByUsername(username);
        requireEmployerOrAdmin(user);
        Company company = companyService.requireOwnedCompany(username);
        requireCategory(request.getCategoryId());

        Job job = new Job();
        job.setCompanyId(company.getId());
        applyFields(job, request.getCategoryId(), request.getTitle(), request.getDescription(), request.getRequirements(),
            request.getLocation(), request.getJobType(), request.getWorkMode(), request.getExperienceLevel(),
            request.getSalaryMin(), request.getSalaryMax(), request.getCurrency(), request.getVacancyCount(),
            request.getApplicationDeadline());
        job.setStatus("OPEN");
        jobMapper.insert(job);
        return getJobById(job.getId());
    }

    public JobResponse updateJob(String username, Long jobId, JobUpdateRequest request) {
        User user = userService.getUserByUsername(username);
        Job existing = requireOwnedJob(user, jobId);
        requireCategory(request.getCategoryId());
        applyFields(existing, request.getCategoryId(), request.getTitle(), request.getDescription(), request.getRequirements(),
            request.getLocation(), request.getJobType(), request.getWorkMode(), request.getExperienceLevel(),
            request.getSalaryMin(), request.getSalaryMax(), request.getCurrency(), request.getVacancyCount(),
            request.getApplicationDeadline());
        jobMapper.update(existing);
        return getJobById(jobId);
    }

    public JobResponse updateJobStatus(String username, Long jobId, JobStatusUpdateRequest request) {
        User user = userService.getUserByUsername(username);
        requireOwnedJob(user, jobId);
        String status = requireText(request.getStatus(), "Job status is required").toUpperCase();
        jobMapper.updateStatus(jobId, status);
        return getJobById(jobId);
    }

    public Job requireJob(Long jobId) {
        Job job = jobMapper.findById(jobId);
        if (job == null) {
            throw new ResourceNotFoundException("Job not found");
        }
        return job;
    }

    private Job requireOwnedJob(User user, Long jobId) {
        Job job = requireJob(jobId);
        if (isAdmin(user)) {
            return job;
        }
        Company company = companyService.requireOwnedCompany(user.getUsername());
        if (!job.getCompanyId().equals(company.getId())) {
            throw new ForbiddenOperationException("You are not allowed to manage this job");
        }
        return job;
    }

    private void requireEmployerOrAdmin(User user) {
        if (!"ROLE_EMPLOYER".equals(user.getRole()) && !isAdmin(user)) {
            throw new ForbiddenOperationException("Only employers or admins can manage jobs");
        }
    }

    private void requireCategory(Long categoryId) {
        if (categoryId == null || jobCategoryMapper.findById(categoryId) == null) {
            throw new ResourceNotFoundException("Job category not found");
        }
    }

    private void applyFields(Job job,
                             Long categoryId,
                             String title,
                             String description,
                             String requirements,
                             String location,
                             String jobType,
                             String workMode,
                             String experienceLevel,
                             java.math.BigDecimal salaryMin,
                             java.math.BigDecimal salaryMax,
                             String currency,
                             Integer vacancyCount,
                             java.time.LocalDate applicationDeadline) {
        job.setCategoryId(categoryId);
        job.setTitle(requireText(title, "Job title is required"));
        job.setDescription(requireText(description, "Job description is required"));
        job.setRequirements(blankToNull(requirements));
        job.setLocation(requireText(location, "Job location is required"));
        job.setJobType(requireText(jobType, "Job type is required").toUpperCase());
        job.setWorkMode(defaultValue(workMode, "ONSITE").toUpperCase());
        job.setExperienceLevel(defaultValue(experienceLevel, "ENTRY").toUpperCase());
        job.setSalaryMin(salaryMin);
        job.setSalaryMax(salaryMax);
        job.setCurrency(defaultValue(currency, "USD").toUpperCase());
        job.setVacancyCount(vacancyCount == null ? 1 : vacancyCount);
        job.setApplicationDeadline(applicationDeadline);
    }

    private JobResponse toResponse(Job job) {
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

    private boolean isAdmin(User user) {
        return "ROLE_ADMIN".equals(user.getRole());
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

    private List<String> trimList(List<String> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        List<String> normalized = values.stream()
            .map(this::blankToNull)
            .filter(value -> value != null)
            .collect(Collectors.toList());
        return normalized.isEmpty() ? null : normalized;
    }

    private List<String> normalizeEnumList(List<String> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        List<String> normalized = values.stream()
            .map(this::blankToNull)
            .filter(value -> value != null)
            .map(value -> value.toUpperCase().replace("-", "_").replace(" ", "_"))
            .collect(Collectors.toList());
        return normalized.isEmpty() ? null : normalized;
    }

    private List<String> normalizeWorkModes(List<String> values) {
        List<String> normalized = normalizeEnumList(values);
        if (normalized == null) {
            return null;
        }
        return normalized.stream()
            .map(value -> "ON_SITE".equals(value) ? "ONSITE" : value)
            .collect(Collectors.toList());
    }

    private String defaultValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
