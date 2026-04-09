package com.jobplus.service;

import com.jobplus.dto.UpdateUserProfileRequest;
import com.jobplus.dto.UserProfileResponse;
import com.jobplus.entity.User;
import com.jobplus.exception.ResourceNotFoundException;
import com.jobplus.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
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
