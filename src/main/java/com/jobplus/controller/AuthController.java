package com.jobplus.controller;

import com.jobplus.dto.AuthResponse;
import com.jobplus.dto.LoginRequest;
import com.jobplus.dto.RegisterRequest;
import com.jobplus.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/social/providers")
    public Map<String, Boolean> socialProviders() {
        return authService.getSocialProviderAvailability();
    }

    @GetMapping("/social/links")
    public Map<String, Boolean> linkedProviders(Authentication authentication) {
        return authService.getLinkedProviders(authentication.getName());
    }

    @DeleteMapping("/social/links/{provider}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unlinkProvider(@PathVariable String provider, Authentication authentication) {
        authService.unlinkProvider(authentication.getName(), provider);
    }

    @GetMapping("/social/{provider}/start")
    public void startSocialAuth(@PathVariable String provider,
                                @RequestParam(defaultValue = "signin") String mode,
                                @RequestParam(required = false) String linkToken,
                                HttpServletRequest request,
                                HttpServletResponse response) throws IOException {
        Boolean enabled = authService.getSocialProviderAvailability().get(provider.toLowerCase());
        if (enabled == null || !enabled) {
            response.sendRedirect(frontendBaseUrl + "/auth/callback?error=" + provider + "%20provider%20is%20not%20configured");
            return;
        }
        request.getSession(true).setAttribute("oauth_mode", mode);
        request.getSession().setAttribute("oauth_link_token", linkToken);
        response.sendRedirect("/oauth2/authorization/" + provider);
    }
}
