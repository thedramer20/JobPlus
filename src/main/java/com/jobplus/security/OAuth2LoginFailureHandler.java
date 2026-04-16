package com.jobplus.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
        throws IOException, ServletException {
        request.getSession().removeAttribute("oauth_mode");
        request.getSession().removeAttribute("oauth_link_token");
        String redirectUrl = UriComponentsBuilder.fromUriString(frontendBaseUrl)
            .path("/auth/callback")
            .queryParam("error", exception.getMessage())
            .build(true)
            .toUriString();
        response.sendRedirect(redirectUrl);
    }
}
