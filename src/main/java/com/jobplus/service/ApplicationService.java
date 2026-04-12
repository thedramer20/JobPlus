package com.jobplus.service;

import com.jobplus.dto.ApplicationCreateRequest;
import com.jobplus.dto.ApplicationResponse;
import com.jobplus.dto.ApplicationStatusUpdateRequest;
import com.jobplus.entity.ApplicationStatusHistory;
import com.jobplus.entity.Company;
import com.jobplus.entity.Job;
import com.jobplus.entity.JobApplication;
import com.jobplus.entity.User;
import com.jobplus.exception.ForbiddenOperationException;
import com.jobplus.exception.ResourceNotFoundException;
import com.jobplus.mapper.ApplicationMapper;
import com.jobplus.mapper.ApplicationStatusHistoryMapper;
import com.jobplus.mapper.CompanyMapper;
import com.jobplus.mapper.ResumeMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {
    private final ApplicationMapper applicationMapper;
    private final ApplicationStatusHistoryMapper applicationStatusHistoryMapper;
    private final ResumeMapper resumeMapper;
    private final CompanyMapper companyMapper;
    private final UserService userService;
    private final JobService jobService;
    private final CompanyService companyService;
    private final NotificationService notificationService;

    public ApplicationService(ApplicationMapper applicationMapper,
                              ApplicationStatusHistoryMapper applicationStatusHistoryMapper,
                              ResumeMapper resumeMapper,
                              CompanyMapper companyMapper,
                              UserService userService,
                              JobService jobService,
                              CompanyService companyService,
                              NotificationService notificationService) {
        this.applicationMapper = applicationMapper;
        this.applicationStatusHistoryMapper = applicationStatusHistoryMapper;
        this.resumeMapper = resumeMapper;
        this.companyMapper = companyMapper;
        this.userService = userService;
        this.jobService = jobService;
        this.companyService = companyService;
        this.notificationService = notificationService;
    }

    public ApplicationResponse apply(String username, ApplicationCreateRequest request) {
        User user = userService.getUserByUsername(username);
        requireCandidate(user);

        Job job = jobService.requireJob(request.getJobId());
        if (!"OPEN".equals(job.getStatus())) {
            throw new IllegalArgumentException("Applications are only allowed for open jobs");
        }
        if (request.getResumeId() != null) {
            var resume = resumeMapper.findById(request.getResumeId());
            if (resume == null || !resume.getUserId().equals(user.getId())) {
                throw new IllegalArgumentException("Resume not found for this user");
            }
        }
        if (applicationMapper.existsByJobIdAndCandidateUserId(job.getId(), user.getId())) {
            throw new IllegalArgumentException("You have already applied for this job");
        }

        JobApplication application = new JobApplication();
        application.setJobId(job.getId());
        application.setCandidateUserId(user.getId());
        application.setResumeId(request.getResumeId());
        application.setCoverLetter(blankToNull(request.getCoverLetter()));
        application.setStatus("PENDING");
        applicationMapper.insert(application);

        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplicationId(application.getId());
        history.setOldStatus(null);
        history.setNewStatus("PENDING");
        history.setChangedByUserId(user.getId());
        history.setNote("Application submitted");
        applicationStatusHistoryMapper.insert(history);

        notificationService.createNotification(
            user.getId(),
            "APPLICATION",
            "Application submitted for \"" + job.getTitle() + "\"."
        );
        Company company = companyMapper.findById(job.getCompanyId());
        if (company != null && company.getOwnerUserId() != null && !company.getOwnerUserId().equals(user.getId())) {
            notificationService.createNotification(
                company.getOwnerUserId(),
                "APPLICATION",
                "New application received for \"" + job.getTitle() + "\"."
            );
        }

        return toResponse(applicationMapper.findById(application.getId()));
    }

    public List<ApplicationResponse> getMyApplications(String username) {
        User user = userService.getUserByUsername(username);
        return applicationMapper.findByCandidateUserId(user.getId()).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsByJob(String username, Long jobId) {
        User user = userService.getUserByUsername(username);
        Job job = jobService.requireJob(jobId);

        if (!isAdmin(user)) {
            Company company = companyService.requireOwnedCompany(username);
            if (!job.getCompanyId().equals(company.getId())) {
                throw new ForbiddenOperationException("You are not allowed to view applications for this job");
            }
        }

        return applicationMapper.findByJobId(jobId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public ApplicationResponse updateApplicationStatus(String username, Long applicationId, ApplicationStatusUpdateRequest request) {
        User user = userService.getUserByUsername(username);
        JobApplication application = applicationMapper.findById(applicationId);
        if (application == null) {
            throw new ResourceNotFoundException("Application not found");
        }

        Job job = jobService.requireJob(application.getJobId());
        if (!isAdmin(user)) {
            Company company = companyService.requireOwnedCompany(username);
            if (!job.getCompanyId().equals(company.getId())) {
                throw new ForbiddenOperationException("You are not allowed to update this application");
            }
        }

        String newStatus = requireText(request.getStatus(), "Application status is required").toUpperCase();
        String oldStatus = application.getStatus();
        applicationMapper.updateStatus(applicationId, newStatus);

        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplicationId(applicationId);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedByUserId(user.getId());
        history.setNote("Application status updated");
        applicationStatusHistoryMapper.insert(history);

        notificationService.createNotification(
            application.getCandidateUserId(),
            "APPLICATION",
            "Your application for \"" + job.getTitle() + "\" is now " + newStatus + "."
        );

        return toResponse(applicationMapper.findById(applicationId));
    }

    private ApplicationResponse toResponse(JobApplication application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setJobId(application.getJobId());
        response.setJobTitle(application.getJobTitle());
        response.setCandidateUserId(application.getCandidateUserId());
        response.setCandidateUsername(application.getCandidateUsername());
        response.setResumeId(application.getResumeId());
        response.setCoverLetter(application.getCoverLetter());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());
        response.setUpdatedAt(application.getUpdatedAt());
        return response;
    }

    private void requireCandidate(User user) {
        if (!"ROLE_CANDIDATE".equals(user.getRole())) {
            throw new ForbiddenOperationException("Only candidates can apply for jobs");
        }
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
}
