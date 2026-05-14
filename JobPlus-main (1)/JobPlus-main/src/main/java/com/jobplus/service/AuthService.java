package com.jobplus.service;

import com.jobplus.dto.AuthResponse;
import com.jobplus.dto.LoginRequest;
import com.jobplus.dto.RegisterRequest;
import com.jobplus.entity.OAuthAccount;
import com.jobplus.entity.User;
import com.jobplus.mapper.OAuthAccountMapper;
import com.jobplus.mapper.UserMapper;
import com.jobplus.security.JwtService;
import com.jobplus.security.UserDetailsServiceImpl;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {
    private final UserMapper userMapper;
    private final OAuthAccountMapper oauthAccountMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.github.client-id:}")
    private String githubClientId;

    public AuthService(UserMapper userMapper,
                       OAuthAccountMapper oauthAccountMapper,
                       PasswordEncoder passwordEncoder,
                       UserDetailsServiceImpl userDetailsService,
                       JwtService jwtService) {
        this.userMapper = userMapper;
        this.oauthAccountMapper = oauthAccountMapper;
        this.passwordEncoder = passwordEncoder;
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
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
        if (!isStrongPassword(password)) {
            throw new IllegalArgumentException("Password must include uppercase, lowercase, and a number");
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
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new BadCredentialsException("Invalid username or password");
        }
        if (password == null || !passwordEncoder.matches(password, user.getPassword())) {
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

    private boolean isStrongPassword(String password) {
        if (password == null) {
            return false;
        }
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        return hasUpper && hasLower && hasDigit;
    }

    public SocialAuthResult handleSocialAuth(String provider,
                                             Map<String, Object> attributes,
                                             String mode,
                                             String linkingToken) {
        String normalizedProvider = normalizeProvider(provider);
        String providerUserId = extractProviderUserId(normalizedProvider, attributes);
        String email = extractProviderEmail(normalizedProvider, attributes);
        String displayName = extractProviderDisplayName(normalizedProvider, attributes);

        if (providerUserId == null || providerUserId.isBlank()) {
            throw new IllegalArgumentException("Unable to identify social account.");
        }

        User linkedUser;
        if ("link".equalsIgnoreCase(mode)) {
            linkedUser = resolveUserFromToken(linkingToken);
            if (linkedUser == null) {
                throw new IllegalArgumentException("Linking session expired. Sign in again and retry linking.");
            }
            linkProviderToUser(linkedUser, normalizedProvider, providerUserId, email);
            return buildSocialResult(linkedUser, normalizedProvider, true, "link");
        }

        OAuthAccount existingAccount = oauthAccountMapper.findByProviderAndProviderUserId(normalizedProvider, providerUserId);
        if (existingAccount != null) {
            linkedUser = userMapper.findById(existingAccount.getUserId());
            existingAccount.setProviderEmail(email);
            oauthAccountMapper.updateLastLogin(existingAccount);
            return buildSocialResult(linkedUser, normalizedProvider, true, "signin");
        }

        if (email != null && !email.isBlank()) {
            User existingByEmail = userMapper.findByEmail(email.toLowerCase());
            if (existingByEmail != null) {
                linkProviderToUser(existingByEmail, normalizedProvider, providerUserId, email);
                return buildSocialResult(existingByEmail, normalizedProvider, true, "signin");
            }
        }

        User created = createSocialUser(normalizedProvider, displayName, email);
        linkProviderToUser(created, normalizedProvider, providerUserId, email);
        return buildSocialResult(created, normalizedProvider, true, "signin");
    }

    public Map<String, Boolean> getSocialProviderAvailability() {
        Map<String, Boolean> providers = new LinkedHashMap<>();
        providers.put("google", googleClientId != null && !googleClientId.isBlank());
        providers.put("github", githubClientId != null && !githubClientId.isBlank());
        return providers;
    }

    public Map<String, Boolean> getLinkedProviders(String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<OAuthAccount> links = oauthAccountMapper.findByUserId(user.getId());
        Map<String, Boolean> result = new LinkedHashMap<>();
        result.put("google", false);
        result.put("github", false);
        for (OAuthAccount account : links) {
            result.put(account.getProvider().toLowerCase(), true);
        }
        return result;
    }

    public void unlinkProvider(String username, String provider) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        oauthAccountMapper.deleteByUserIdAndProvider(user.getId(), normalizeProvider(provider));
    }

    private SocialAuthResult buildSocialResult(User user, String provider, boolean linked, String mode) {
        UserDetails details = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(details);
        return new SocialAuthResult(new AuthResponse(token, user.getUsername(), user.getRole()), provider, linked, mode);
    }

    private void linkProviderToUser(User user, String provider, String providerUserId, String email) {
        OAuthAccount linkedByProvider = oauthAccountMapper.findByProviderAndProviderUserId(provider, providerUserId);
        if (linkedByProvider != null && !linkedByProvider.getUserId().equals(user.getId())) {
            throw new IllegalArgumentException("This social account is already linked to another user.");
        }

        OAuthAccount existingForUserProvider = oauthAccountMapper.findByUserIdAndProvider(user.getId(), provider);
        if (existingForUserProvider != null) {
            existingForUserProvider.setProviderEmail(email);
            oauthAccountMapper.updateLastLogin(existingForUserProvider);
            return;
        }

        OAuthAccount account = new OAuthAccount();
        account.setUserId(user.getId());
        account.setProvider(provider);
        account.setProviderUserId(providerUserId);
        account.setProviderEmail(email);
        oauthAccountMapper.insert(account);
    }

    private User createSocialUser(String provider, String displayName, String email) {
        String baseUsername = slugify(displayName);
        if (baseUsername == null || baseUsername.isBlank()) {
            baseUsername = provider + "_user";
        }
        String candidate = baseUsername;
        int suffix = 1;
        while (userMapper.existsByUsername(candidate)) {
            candidate = baseUsername + suffix;
            suffix++;
        }

        String normalizedEmail = (email == null || email.isBlank())
            ? candidate + "@" + provider + ".jobplus.social"
            : email.toLowerCase();
        if (userMapper.existsByEmail(normalizedEmail)) {
            normalizedEmail = candidate + "+" + System.currentTimeMillis() + "@jobplus.social";
        }

        User user = new User();
        user.setUsername(candidate);
        user.setFullName((displayName == null || displayName.isBlank()) ? candidate : displayName);
        user.setEmail(normalizedEmail);
        user.setPhone(null);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRole("ROLE_CANDIDATE");
        user.setStatus("ACTIVE");
        userMapper.insert(user);
        return user;
    }

    private User resolveUserFromToken(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        try {
            String username = jwtService.extractUsername(token);
            return userMapper.findByUsername(username);
        } catch (Exception ignored) {
            return null;
        }
    }

    private String normalizeProvider(String provider) {
        if (provider == null) {
            throw new IllegalArgumentException("Provider is required.");
        }
        String normalized = provider.trim().toLowerCase();
        if (!normalized.equals("google") && !normalized.equals("github")) {
            throw new IllegalArgumentException("Unsupported social provider.");
        }
        return normalized;
    }

    private String extractProviderUserId(String provider, Map<String, Object> attributes) {
        Object value = attributes.get("sub");
        if ("github".equals(provider)) {
            value = attributes.get("id");
        }
        return value == null ? null : String.valueOf(value);
    }

    private String extractProviderEmail(String provider, Map<String, Object> attributes) {
        Object value = attributes.get("email");
        if (value == null && "github".equals(provider)) {
            value = attributes.get("login");
            if (value != null) {
                return value + "@users.noreply.github.com";
            }
        }
        return value == null ? null : String.valueOf(value);
    }

    private String extractProviderDisplayName(String provider, Map<String, Object> attributes) {
        Object value = attributes.get("name");
        if (value == null && "github".equals(provider)) {
            value = attributes.get("login");
        }
        return value == null ? provider + " user" : String.valueOf(value);
    }

    private String slugify(String input) {
        if (input == null) return null;
        String normalized = input.trim().toLowerCase().replaceAll("[^a-z0-9]+", ".");
        return normalized.replaceAll("(^\\.)|(\\.$)", "");
    }

    public static class SocialAuthResult {
        private final AuthResponse authResponse;
        private final String provider;
        private final boolean linked;
        private final String mode;

        public SocialAuthResult(AuthResponse authResponse, String provider, boolean linked, String mode) {
            this.authResponse = authResponse;
            this.provider = provider;
            this.linked = linked;
            this.mode = mode;
        }

        public AuthResponse getAuthResponse() {
            return authResponse;
        }

        public String getProvider() {
            return provider;
        }

        public boolean isLinked() {
            return linked;
        }

        public String getMode() {
            return mode;
        }
    }
}
