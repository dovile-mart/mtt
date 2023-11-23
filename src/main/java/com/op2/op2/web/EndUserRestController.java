package com.op2.op2.web;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.op2.op2.domain.EndUser;
import com.op2.op2.domain.EndUserRepository;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin("http://localhost:5173")
@Tag(name = "User REST", description="Information on users")
public class EndUserRestController {
    private final Logger log = LoggerFactory.getLogger(EndUserRestController.class);
    
    @Autowired
    private EndUserRepository userRepo;

    //get all users json
    @GetMapping({ "/users" })
    public @ResponseBody List<EndUser> findAllEndUsers(){
        log.info("Fetch all users");
        try {
            return (List<EndUser>) userRepo.findAll();
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No users found");
        }
        
    }
    //get user by username
    @GetMapping("/users/{name}")
    public @ResponseBody Optional<EndUser> getUEndUser(@PathVariable("name") String username){
        log.info("Fetch user by username");
        try {
            return userRepo.findByUsername(username);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find user with username " + username);
        }
    }
    @PostMapping({ "/users" })
    public @ResponseBody EndUser savEndUserRest(@RequestBody EndUser endUser){
        return userRepo.save(endUser);
    }

    @DeleteMapping({ "/users/{id}" })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEndUser(@PathVariable("id") Long userId){
        try {
            userRepo.deleteById(userId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find user with id " + userId);
        }
    }

    @PutMapping({ "/users/{id}" })
    @ResponseStatus(HttpStatus.CREATED)
    public EndUser updateEndUser(@RequestBody EndUser updatedUser, @PathVariable("id") Long userId) {
    Optional<EndUser> endUser = userRepo.findById(userId);
    if (endUser.isEmpty()){
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find user");
    } try{
        updatedUser.setUserId(userId);
        return userRepo.save(updatedUser);
    } catch (Exception e){
        throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Could not accept");
    }
    }
}
