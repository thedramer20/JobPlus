package com.jobplus.service;

import com.jobplus.dto.ResumeCreateRequest;
import com.jobplus.dto.ResumeResponse;
import com.jobplus.entity.Resume;
import com.jobplus.entity.User;
import com.jobplus.exception.ForbiddenOperationException;
import com.jobplus.exception.ResourceNotFoundException;
import com.jobplus.mapper.ResumeMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeService {
    private final ResumeMapper resumeMapper;
    private final UserService userService;

    public ResumeService(ResumeMapper resumeMapper, UserService userService) {
        this.resumeMapper = resumeMapper;
        this.userService = userService;
    }

    public List<ResumeResponse> getMyResumes(String username) {
        User user = requireCandidate(username);
        return resumeMapper.findByUserId(user.getId()).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public ResumeResponse createResume(String username, ResumeCreateRequest request) {
        User user = requireCandidate(username);
        Resume resume = new Resume();
        resume.setUserId(user.getId());
        resume.setFileName(requireText(request.getFileName(), "Resume file name is required"));
        resume.setFilePath(requireText(request.getFilePath(), "Resume file path is required"));
        resumeMapper.insert(resume);
        return toResponse(resumeMapper.findById(resume.getId()));
    }

    public void deleteResume(String username, Long resumeId) {
        User user = requireCandidate(username);
        Resume resume = resumeMapper.findById(resumeId);
        if (resume == null || !resume.getUserId().equals(user.getId())) {
            throw new ResourceNotFoundException("Resume not found");
        }
        resumeMapper.deleteByIdAndUserId(resumeId, user.getId());
    }

    private ResumeResponse toResponse(Resume resume) {
        ResumeResponse response = new ResumeResponse();
        response.setId(resume.getId());
        response.setUserId(resume.getUserId());
        response.setFileName(resume.getFileName());
        response.setFilePath(resume.getFilePath());
        response.setUploadedAt(resume.getUploadedAt());
        return response;
    }

    private User requireCandidate(String username) {
        User user = userService.getUserByUsername(username);
        if (!"ROLE_CANDIDATE".equals(user.getRole())) {
            throw new ForbiddenOperationException("Only candidates can manage resumes");
        }
        return user;
    }

    private String requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }
}
