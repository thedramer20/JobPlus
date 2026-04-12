package com.jobplus.service;

import com.jobplus.dto.AuthResponse;
import com.jobplus.dto.LoginRequest;
import com.jobplus.dto.RegisterRequest;
import com.jobplus.entity.User;
import com.jobplus.mapper.UserMapper;
import com.jobplus.security.JwtService;
import com.jobplus.security.UserDetailsServiceImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;

    public AuthService(UserMapper userMapper,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       UserDetailsServiceImpl userDetailsService,
                       JwtService jwtService) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String username = safeTrim(request.getUsername());
        String password = request.getPassword();
        String role = normalizeRole(request.getRole());
        String fullName = safeTrim(request.getFullName());
        String email = safeTrim(request.getEmail());
        String phone = safeTrim(request.getPhone());

        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (userMapper.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (email == null || email.isEmpty()) {
            email = username.toLowerCase() + "@jobplus.app";
        } else {
            email = email.toLowerCase();
        }
        if (userMapper.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName == null || fullName.isBlank() ? username : fullName);
        user.setEmail(email);
        user.setPhone(phone == null || phone.isBlank() ? null : phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setStatus("ACTIVE");
        userMapper.insert(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, username, role);
    }

    public AuthResponse login(LoginRequest request) {
        String username = safeTrim(request.getUsername());
        String password = request.getPassword();
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (Exception ex) {
            throw new BadCredentialsException("Invalid username or password");
        }

        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new BadCredentialsException("Invalid username or password");
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "ROLE_CANDIDATE";
        }
        String normalized = role.trim().toUpperCase();
        String prefixed = normalized.startsWith("ROLE_") ? normalized : "ROLE_" + normalized;
        if (!prefixed.equals("ROLE_CANDIDATE") && !prefixed.equals("ROLE_EMPLOYER") && !prefixed.equals("ROLE_ADMIN")) {
            throw new IllegalArgumentException("Role must be CANDIDATE, EMPLOYER, or ADMIN");
        }
        return prefixed;
    }

    private String safeTrim(String value) {
        return value == null ? null : value.trim();
    }
}
