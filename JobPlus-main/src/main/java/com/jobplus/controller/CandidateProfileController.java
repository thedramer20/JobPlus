package com.jobplus.controller;

import com.jobplus.dto.CandidateProfileRequest;
import com.jobplus.dto.CandidateProfileResponse;
import com.jobplus.service.CandidateProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/candidate-profile")
public class CandidateProfileController {
    private final CandidateProfileService candidateProfileService;

    public CandidateProfileController(CandidateProfileService candidateProfileService) {
        this.candidateProfileService = candidateProfileService;
    }

    @GetMapping("/me")
    public CandidateProfileResponse getCurrentProfile(Authentication authentication) {
        return candidateProfileService.getCurrentProfile(authentication.getName());
    }

    @PutMapping("/me")
    public CandidateProfileResponse upsertCurrentProfile(@RequestBody CandidateProfileRequest request,
                                                         Authentication authentication) {
        return candidateProfileService.upsertCurrentProfile(authentication.getName(), request);
    }
}
