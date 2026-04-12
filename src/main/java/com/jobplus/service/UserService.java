package com.jobplus.service;

import com.jobplus.dto.ChangePasswordRequest;
import com.jobplus.dto.UpdateUserProfileRequest;
import com.jobplus.dto.UserProfileResponse;
import com.jobplus.entity.User;
import com.jobplus.exception.ResourceNotFoundException;
import com.jobplus.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public User getUserByUsername(String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }
        return user;
    }

    public UserProfileResponse getCurrentUserProfile(String username) {
        return toResponse(getUserByUsername(username));
    }

    public UserProfileResponse updateCurrentUserProfile(String username, UpdateUserProfileRequest request) {
        User user = getUserByUsername(username);
        user.setFullName(requireText(request.getFullName(), "Full name is required"));
        user.setEmail(blankToNull(request.getEmail()));
        user.setPhone(blankToNull(request.getPhone()));
        userMapper.updateProfile(user);
        return toResponse(getUserByUsername(username));
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = getUserByUsername(username);
        String currentPassword = requireText(request.getCurrentPassword(), "Current password is required");
        String newPassword = requireText(request.getNewPassword(), "New password is required");
        String confirmPassword = requireText(request.getConfirmPassword(), "Confirm password is required");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }
        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        userMapper.updatePasswordHash(user.getId(), passwordEncoder.encode(newPassword));
    }

    private UserProfileResponse toResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        return response;
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
