package com.jobportal.controller;

import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository repo;

    public AuthController(UserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/register")
    public Object register(@RequestBody User user) {
        User existingUser = repo.findByEmail(user.getEmail());

        if (existingUser != null) {
            return "Email already registered";
        }

        user.setRole("USER");
        return repo.save(user);
    }

    @PostMapping("/login")
    public Object login(@RequestBody User user) {
        User loggedUser = repo.findByEmailAndPassword(user.getEmail(), user.getPassword());

        if (loggedUser == null) {
            return "Invalid email or password";
        }

        return loggedUser;
    }

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable int id) {
        return repo.findById(id).orElse(null);
    }
}