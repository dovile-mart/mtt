package com.op2.op2.config;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.op2.op2.services.JwtService;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {
	private final JwtService jwtService;

	public AuthenticationFilter(JwtService jwtService) {
		this.jwtService = jwtService;
	}

	@Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, java.io.IOException {
        // Get token from the Authorization header
        String jws = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("JWT ON " + jws);
        if (jws != null) {
            // Verify token and get user
                        System.out.println("JUKKA IS ");
            String user = jwtService.getAuthUser(request);
            System.out.println("USER IS "+ user);
            // Authenticate
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                user, null, java.util.Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
