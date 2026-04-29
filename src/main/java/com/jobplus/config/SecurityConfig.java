package com.jobplus.config;

import com.jobplus.security.JwtAuthenticationFilter;
import com.jobplus.security.OAuth2LoginFailureHandler;
import com.jobplus.security.OAuth2LoginSuccessHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final OAuth2LoginSuccessHandler oauth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oauth2LoginFailureHandler;
    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;
    @Value("${spring.security.oauth2.client.registration.github.client-id:}")
    private String githubClientId;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          AuthenticationEntryPoint authenticationEntryPoint,
                          OAuth2LoginSuccessHandler oauth2LoginSuccessHandler,
                          OAuth2LoginFailureHandler oauth2LoginFailureHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.oauth2LoginSuccessHandler = oauth2LoginSuccessHandler;
        this.oauth2LoginFailureHandler = oauth2LoginFailureHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(authenticationEntryPoint)
            .and()
            .authorizeRequests()
            .antMatchers("/auth/**", "/h2-console/**", "/oauth2/**", "/login/oauth2/**").permitAll()
            .antMatchers(HttpMethod.GET, "/jobs/**", "/api/companies/**", "/job-categories/**", "/post-categories/**", "/posts/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .headers(headers -> headers.frameOptions().disable())
            .httpBasic(Customizer.withDefaults());

        if (isOauthEnabled()) {
            http.oauth2Login()
                .successHandler(oauth2LoginSuccessHandler)
                .failureHandler(oauth2LoginFailureHandler);
        }

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private boolean isOauthEnabled() {
        return (googleClientId != null && !googleClientId.isBlank())
            || (githubClientId != null && !githubClientId.isBlank());
    }

}
