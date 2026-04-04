package com.jobplus.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobController {

    @GetMapping("/jobs")
    public String getJobs() {
        return "List of jobs";
    }
}
