package com.jobplus.security;

import com.jobplus.dto.AuthResponse;
import com.jobplus.service.AuthService;
import com.jobplus.service.AuthService.SocialAuthResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final AuthService authService;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public OAuth2LoginSuccessHandler(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
        throws IOException, ServletException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User principal = oauthToken.getPrincipal();
        String provider = oauthToken.getAuthorizedClientRegistrationId();
        String mode = String.valueOf(request.getSession().getAttribute("oauth_mode"));
        String linkToken = (String) request.getSession().getAttribute("oauth_link_token");

        request.getSession().removeAttribute("oauth_mode");
        request.getSession().removeAttribute("oauth_link_token");

        try {
            SocialAuthResult result = authService.handleSocialAuth(provider, principal.getAttributes(), mode, linkToken);
            AuthResponse authResponse = result.getAuthResponse();
            String redirectUrl = UriComponentsBuilder.fromUriString(frontendBaseUrl)
                .path("/auth/callback")
                .queryParam("token", authResponse.getToken())
                .queryParam("username", authResponse.getUsername())
                .queryParam("role", authResponse.getRole())
                .queryParam("provider", result.getProvider())
                .queryParam("mode", result.getMode())
                .queryParam("linked", result.isLinked())
                .build(true)
                .toUriString();
            response.sendRedirect(redirectUrl);
        } catch (Exception ex) {
            String redirectUrl = UriComponentsBuilder.fromUriString(frontendBaseUrl)
                .path("/auth/callback")
                .queryParam("error", ex.getMessage())
                .queryParam("provider", provider)
                .build(true)
                .toUriString();
            response.sendRedirect(redirectUrl);
        }
    }
}
