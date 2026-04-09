package com.jobplus.controller;

import com.jobplus.dto.UpdateUserProfileRequest;
import com.jobplus.dto.UserProfileResponse;
import com.jobplus.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(Authentication authentication) {
        return userService.getCurrentUserProfile(authentication.getName());
    }

    @PutMapping("/me")
    public UserProfileResponse updateCurrentUser(@RequestBody UpdateUserProfileRequest request,
                                                 Authentication authentication) {
        return userService.updateCurrentUserProfile(authentication.getName(), request);
    }
}
