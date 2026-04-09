package com.jobplus.controller;

import com.jobplus.dto.CompanyCreateRequest;
import com.jobplus.dto.CompanyResponse;
import com.jobplus.dto.CompanyUpdateRequest;
import com.jobplus.service.CompanyService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public CompanyResponse createCompany(@RequestBody CompanyCreateRequest request, Authentication authentication) {
        return companyService.createCompany(authentication.getName(), request);
    }

    @GetMapping("/me")
    public CompanyResponse getMyCompany(Authentication authentication) {
        return companyService.getMyCompany(authentication.getName());
    }

    @GetMapping("/{id}")
    public CompanyResponse getCompanyById(@PathVariable Long id) {
        return companyService.getCompanyById(id);
    }

    @PutMapping("/{id}")
    public CompanyResponse updateCompany(@PathVariable Long id,
                                         @RequestBody CompanyUpdateRequest request,
                                         Authentication authentication) {
        return companyService.updateCompany(authentication.getName(), id, request);
    }
}
