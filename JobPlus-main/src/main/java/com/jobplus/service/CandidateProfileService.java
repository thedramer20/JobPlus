package com.jobplus.service;

import com.jobplus.dto.CandidateProfileRequest;
import com.jobplus.dto.CandidateProfileResponse;
import com.jobplus.entity.CandidateProfile;
import com.jobplus.entity.User;
import com.jobplus.exception.ForbiddenOperationException;
import com.jobplus.mapper.CandidateProfileMapper;
import org.springframework.stereotype.Service;

@Service
public class CandidateProfileService {
    private final CandidateProfileMapper candidateProfileMapper;
    private final UserService userService;

    public CandidateProfileService(CandidateProfileMapper candidateProfileMapper, UserService userService) {
        this.candidateProfileMapper = candidateProfileMapper;
        this.userService = userService;
    }

    public CandidateProfileResponse getCurrentProfile(String username) {
        User user = requireCandidate(username);
        CandidateProfile profile = candidateProfileMapper.findByUserId(user.getId());
        if (profile == null) {
            profile = new CandidateProfile();
            profile.setUserId(user.getId());
        }
        return toResponse(user, profile);
    }

    public CandidateProfileResponse upsertCurrentProfile(String username, CandidateProfileRequest request) {
        User user = requireCandidate(username);
        CandidateProfile existing = candidateProfileMapper.findByUserId(user.getId());

        CandidateProfile profile = existing == null ? new CandidateProfile() : existing;
        profile.setUserId(user.getId());
        profile.setAddress(blankToNull(request.getAddress()));
        profile.setEducation(blankToNull(request.getEducation()));
        profile.setExperienceSummary(blankToNull(request.getExperienceSummary()));
        profile.setAvatarUrl(blankToNull(request.getAvatarUrl()));
        profile.setLinkedinUrl(blankToNull(request.getLinkedinUrl()));
        profile.setGithubUrl(blankToNull(request.getGithubUrl()));

        if (existing == null) {
            candidateProfileMapper.insert(profile);
        } else {
            candidateProfileMapper.update(profile);
        }

        return toResponse(user, candidateProfileMapper.findByUserId(user.getId()));
    }

    private CandidateProfileResponse toResponse(User user, CandidateProfile profile) {
        CandidateProfileResponse response = new CandidateProfileResponse();
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setAddress(profile.getAddress());
        response.setEducation(profile.getEducation());
        response.setExperienceSummary(profile.getExperienceSummary());
        response.setAvatarUrl(profile.getAvatarUrl());
        response.setLinkedinUrl(profile.getLinkedinUrl());
        response.setGithubUrl(profile.getGithubUrl());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }

    private User requireCandidate(String username) {
        User user = userService.getUserByUsername(username);
        if (!"ROLE_CANDIDATE".equals(user.getRole())) {
            throw new ForbiddenOperationException("Only candidates can manage candidate profiles");
        }
        return user;
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
