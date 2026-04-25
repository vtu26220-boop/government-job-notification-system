package com.jobportal.controller;

import com.jobportal.entity.JobApplication;
import com.jobportal.repository.ApplicationRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin("*")
public class ApplicationController {

    private final ApplicationRepository repo;

    public ApplicationController(ApplicationRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/apply")
    public Object applyJob(@RequestBody JobApplication app) {

        boolean alreadyApplied = repo.existsByUserIdAndJobId(app.getUserId(), app.getJobId());

        if (alreadyApplied) {
            return "Already applied for this job";
        }

        app.setApplicationStatus("APPLIED");
        app.setAppliedDate(LocalDate.now());

        return repo.save(app);
    }

    @GetMapping("/user/{userId}")
    public List<JobApplication> getUserApplications(@PathVariable int userId) {
        return repo.findByUserId(userId);
    }

    @GetMapping("/all")
    public List<JobApplication> getAllApplications() {
        return repo.findAll();
    }

    @PutMapping("/status/{id}/{status}")
    public Object updateStatus(@PathVariable int id, @PathVariable String status) {
        JobApplication app = repo.findById(id).orElse(null);

        if (app == null) {
            return "Application not found";
        }

        app.setApplicationStatus(status);
        return repo.save(app);
    }
}