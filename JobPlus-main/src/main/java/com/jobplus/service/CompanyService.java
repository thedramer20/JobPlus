package com.jobplus.service;

import com.jobplus.dto.CompanyCreateRequest;
import com.jobplus.dto.CompanyResponse;
import com.jobplus.dto.CompanyUpdateRequest;
import com.jobplus.entity.Company;
import com.jobplus.entity.User;
import com.jobplus.exception.ForbiddenOperationException;
import com.jobplus.exception.ResourceNotFoundException;
import com.jobplus.mapper.CompanyMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {
    private final CompanyMapper companyMapper;
    private final UserService userService;

    public CompanyService(CompanyMapper companyMapper, UserService userService) {
        this.companyMapper = companyMapper;
        this.userService = userService;
    }

    public CompanyResponse createCompany(String username, CompanyCreateRequest request) {
        User user = userService.getUserByUsername(username);
        requireEmployerOrAdmin(user);

        if (companyMapper.findByOwnerUserId(user.getId()) != null) {
            throw new IllegalArgumentException("This user already owns a company profile");
        }

        Company company = new Company();
        company.setOwnerUserId(user.getId());
        company.setCompanyName(requireText(request.getCompanyName(), "Company name is required"));
        company.setDescription(blankToNull(request.getDescription()));
        company.setIndustry(blankToNull(request.getIndustry()));
        company.setLocation(blankToNull(request.getLocation()));
        company.setWebsite(blankToNull(request.getWebsite()));
        company.setLogoUrl(blankToNull(request.getLogoUrl()));
        company.setCompanySize(blankToNull(request.getCompanySize()));
        company.setStatus("APPROVED");

        companyMapper.insert(company);
        return toResponse(companyMapper.findById(company.getId()));
    }

    public CompanyResponse getMyCompany(String username) {
        User user = userService.getUserByUsername(username);
        Company company = companyMapper.findByOwnerUserId(user.getId());
        if (company == null) {
            throw new ResourceNotFoundException("Company profile not found");
        }
        return toResponse(company);
    }

    public CompanyResponse getCompanyById(Long companyId) {
        Company company = companyMapper.findById(companyId);
        if (company == null) {
            throw new ResourceNotFoundException("Company not found");
        }
        return toResponse(company);
    }

    public List<CompanyResponse> getAllCompanies() {
        return companyMapper.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CompanyResponse updateCompany(String username, Long companyId, CompanyUpdateRequest request) {
        User user = userService.getUserByUsername(username);
        Company company = companyMapper.findById(companyId);
        if (company == null) {
            throw new ResourceNotFoundException("Company not found");
        }
        if (!isAdmin(user) && !company.getOwnerUserId().equals(user.getId())) {
            throw new ForbiddenOperationException("You are not allowed to update this company");
        }

        company.setCompanyName(requireText(request.getCompanyName(), "Company name is required"));
        company.setDescription(blankToNull(request.getDescription()));
        company.setIndustry(blankToNull(request.getIndustry()));
        company.setLocation(blankToNull(request.getLocation()));
        company.setWebsite(blankToNull(request.getWebsite()));
        company.setLogoUrl(blankToNull(request.getLogoUrl()));
        company.setCompanySize(blankToNull(request.getCompanySize()));
        company.setStatus(request.getStatus() == null || request.getStatus().isBlank() ? company.getStatus() : request.getStatus().trim().toUpperCase());

        companyMapper.update(company);
        return toResponse(companyMapper.findById(companyId));
    }

    public Company requireOwnedCompany(String username) {
        User user = userService.getUserByUsername(username);
        Company company = companyMapper.findByOwnerUserId(user.getId());
        if (company == null) {
            throw new ResourceNotFoundException("Company profile not found for this user");
        }
        return company;
    }

    private CompanyResponse toResponse(Company company) {
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

    private void requireEmployerOrAdmin(User user) {
        if (!"ROLE_EMPLOYER".equals(user.getRole()) && !"ROLE_ADMIN".equals(user.getRole())) {
            throw new ForbiddenOperationException("Only employers or admins can manage company profiles");
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
