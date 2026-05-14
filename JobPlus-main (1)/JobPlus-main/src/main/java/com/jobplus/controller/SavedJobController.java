package com.jobplus.controller;

import com.jobplus.dto.SavedJobRequest;
import com.jobplus.dto.SavedJobResponse;
import com.jobplus.service.SavedJobService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/saved-jobs")
public class SavedJobController {
    private final SavedJobService savedJobService;

    public SavedJobController(SavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    @GetMapping("/me")
    public List<SavedJobResponse> getMySavedJobs(Authentication authentication) {
        return savedJobService.getMySavedJobs(authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SavedJobResponse saveJob(@RequestBody SavedJobRequest request, Authentication authentication) {
        return savedJobService.saveJob(authentication.getName(), request);
    }

    @DeleteMapping("/{jobId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSavedJob(@PathVariable Long jobId, Authentication authentication) {
        savedJobService.removeSavedJob(authentication.getName(), jobId);
    }
}
