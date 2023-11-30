package com.op2.op2.services;

import org.springframework.stereotype.Service;
import com.op2.op2.domain.EndUser;



@Service
public class AuthService {

    private final UserDetailsServiceImpl userDetailsServiceImpl;

    public AuthService(UserDetailsServiceImpl userDetailsServiceImpl) {
        this.userDetailsServiceImpl = userDetailsServiceImpl;
    }

     // Perform user registration logic using the provided request data
    // (e.g., use userDetailsService to save the user details)

    public String register(AuthRequest request) {
        EndUser newUser = new EndUser(
            request.getUsername(),
            request.getPassword(),
            request.getEmail(),
            request.getRole()

        );

        userDetailsServiceImpl.signNewUser(newUser);

        // Return a success message or throw an exception if registration fails
        return "Registration successful!";
    }
}
