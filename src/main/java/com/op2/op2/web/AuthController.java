package com.op2.op2.web;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.op2.op2.domain.AccountCredentials;
import com.op2.op2.domain.EndUserRepository;
import com.op2.op2.services.JwtService;
import com.op2.op2.services.AuthRequest;
import com.op2.op2.services.AuthService;

import jakarta.validation.Valid;
import jakarta.validation.Validator;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.validation.BindingResult;


@RestController
@RequestMapping(path ="/api/auth")
public class AuthController {
    private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final Validator validator;
    private final EndUserRepository endUserRepository;



    public AuthController(AuthService authService, Validator validator,
            EndUserRepository endUserRepository, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.validator = validator;
        this.endUserRepository = endUserRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }
    
    

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest request, BindingResult bindingResult) {
        // Validate the registration request
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = bindingResult.getAllErrors()
                    .stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());

            return ResponseEntity.badRequest().body(errorMessages);
        }

        // If username is taken
        if (endUserRepository.findByUsername(request.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body("Username is taken");
        }
        return ResponseEntity.ok(authService.register(request));
    }

    

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AccountCredentials credentials) {
        UsernamePasswordAuthenticationToken creds = new UsernamePasswordAuthenticationToken(credentials.username(),
                credentials.password());
        Authentication auth = authenticationManager.authenticate(creds);
        // Generate token
        String jwts = jwtService.getToken(auth.getName());

        // Build response with the generated token
        return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, "Bearer " + jwts)
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization").build();
                
    }

    
}
