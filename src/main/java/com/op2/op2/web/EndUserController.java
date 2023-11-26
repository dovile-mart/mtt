package com.op2.op2.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.op2.op2.domain.EndUser;
import com.op2.op2.domain.EndUserRepository;
import com.op2.op2.domain.Event;

import jakarta.validation.Valid;

@Controller
public class EndUserController {

    @Autowired
    private EndUserRepository userRepo;

    @RequestMapping(value= "/userlist", method = RequestMethod.GET)
    public String userlist(Model model){
        List<EndUser> users = (List<EndUser>) userRepo.findAll();
        model.addAttribute("users", users);
        return "userlist";
    }
        //Add new location
    @GetMapping("/addUser")
    public String addUser(Model model) {
        model.addAttribute("newuser", new EndUser());
        return "adduser";
    }

    @PostMapping("/saveUser")
    public String saveUser(@Valid @ModelAttribute("newuser") EndUser endUser, BindingResult bindingResult,
            Model model) {
        if (bindingResult.hasErrors()) {
            return "adduser";
        } else {
            userRepo.save(endUser);
            return "redirect:userlist";
        }
    }

    @RequestMapping(value = "/deleteUser/{userId}", method = RequestMethod.GET)
    public String deleteEndUser(@PathVariable("userId") Long userId) {
        var user = userRepo.findById(userId).get();
        var events = user.getEvents();
        for (Event event : events) {
            event.setEndUser(null);
        }
        userRepo.save(user);
        userRepo.deleteById(userId);
        return "redirect:/userlist";
    }
    
}
