package com.jobplus.service;

import com.jobplus.dto.SavedJobRequest;
import com.jobplus.dto.SavedJobResponse;
import com.jobplus.entity.Job;
import com.jobplus.entity.SavedJob;
import com.jobplus.entity.User;
import com.jobplus.exception.ForbiddenOperationException;
import com.jobplus.mapper.SavedJobMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedJobService {
    private final SavedJobMapper savedJobMapper;
    private final UserService userService;
    private final JobService jobService;

    public SavedJobService(SavedJobMapper savedJobMapper, UserService userService, JobService jobService) {
        this.savedJobMapper = savedJobMapper;
        this.userService = userService;
        this.jobService = jobService;
    }

    public List<SavedJobResponse> getMySavedJobs(String username) {
        User user = requireCandidate(username);
        return savedJobMapper.findByUserId(user.getId()).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public SavedJobResponse saveJob(String username, SavedJobRequest request) {
        User user = requireCandidate(username);
        Long jobId = request.getJobId();
        if (jobId == null) {
            throw new IllegalArgumentException("Job id is required");
        }

        Job job = jobService.requireJob(jobId);
        if (savedJobMapper.findByUserIdAndJobId(user.getId(), jobId) != null) {
            throw new IllegalArgumentException("Job is already saved");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setUserId(user.getId());
        savedJob.setJobId(jobId);
        savedJobMapper.insert(savedJob);
        savedJob.setSavedAt(savedJobMapper.findByUserIdAndJobId(user.getId(), jobId).getSavedAt());
        return toResponse(savedJob, job);
    }

    public void removeSavedJob(String username, Long jobId) {
        User user = requireCandidate(username);
        if (savedJobMapper.deleteByUserIdAndJobId(user.getId(), jobId) == 0) {
            throw new IllegalArgumentException("Saved job not found");
        }
    }

    private SavedJobResponse toResponse(SavedJob savedJob) {
        return toResponse(savedJob, jobService.requireJob(savedJob.getJobId()));
    }

    private SavedJobResponse toResponse(SavedJob savedJob, Job job) {
        SavedJobResponse response = new SavedJobResponse();
        response.setId(savedJob.getId());
        response.setJobId(savedJob.getJobId());
        response.setJobTitle(job.getTitle());
        response.setCompanyName(job.getCompanyName());
        response.setLocation(job.getLocation());
        response.setJobType(job.getJobType());
        response.setStatus(job.getStatus());
        response.setSavedAt(savedJob.getSavedAt());
        return response;
    }

    private User requireCandidate(String username) {
        User user = userService.getUserByUsername(username);
        if (!"ROLE_CANDIDATE".equals(user.getRole())) {
            throw new ForbiddenOperationException("Only candidates can manage saved jobs");
        }
        return user;
    }
}
