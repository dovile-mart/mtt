package com.op2.op2.services;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;



public class AuthRequest {
    @NotBlank(message = "Username must contain at least 4 characters")    
    @Size(min = 4, max = 12, message = "Username must be between 4 and 12 characters")
    private String username = "";

    @NotBlank(message = "Password must contain at least one non-whitespace character")
    @Size(min = 6, message = "Password must have at least 6 characters")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$",
        message = "Password must contain at least one number, one uppercase letter, and one special symbol (@#$%^&+=!)"
    )
    private String password = "";

    @NotBlank(message = "Email must be valid")    
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Email must be valid")
    private String email = "";

    private String role ="user";

    // Constructors, getters, and setters...
    
    public AuthRequest() {
    }

    public AuthRequest(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRole(){
        return role;
    }

    public void setRole(String role){
        this.role = role;
    }


}
