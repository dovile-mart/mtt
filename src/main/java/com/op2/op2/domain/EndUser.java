package com.op2.op2.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotEmpty;

@Entity
public class EndUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long userId;
    @NotEmpty(message = "Username cannot be empty")
    private String username;
    @NotEmpty(message = "Password cannot be empty")
    private String password;
    @NotEmpty(message = "Email cannot be empty")
    private String email;
    private String role;

    @OneToMany(mappedBy = "endUser")
    @JsonIgnore
    private List<Event> events;

    public EndUser(){

    }
    public EndUser (String username, String password, String email, String role){
        super();
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

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

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    @Override 
    public String toString() {
        return "EndUser [ userId = " + userId + "username = " + username + " password = " + password + " email = " + email + " role = " + role + "]";
    }
}
