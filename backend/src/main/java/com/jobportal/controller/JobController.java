package com.jobportal.controller;

import com.jobportal.entity.Job;
import com.jobportal.repository.JobRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin("*")
public class JobController {

    private final JobRepository repo;

    public JobController(JobRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/add")
    public Job addJob(@RequestBody Job job) {
        job.setStatus("PENDING");
        return repo.save(job);
    }

    @GetMapping("/all")
    public List<Job> getAllJobs() {
        return repo.findAll();
    }

    @GetMapping("/approved")
    public List<Job> getApprovedJobs() {
        return repo.findByStatus("APPROVED");
    }

    @GetMapping("/category/{category}")
    public List<Job> getByCategory(@PathVariable String category) {
        return repo.findByCategoryContainingIgnoreCase(category);
    }

    @GetMapping("/search/{title}")
    public List<Job> searchByTitle(@PathVariable String title) {
        return repo.findByTitleContainingIgnoreCase(title);
    }

    @PutMapping("/approve/{id}")
    public Object approveJob(@PathVariable int id) {
        Job job = repo.findById(id).orElse(null);

        if (job == null) {
            return "Job not found";
        }

        job.setStatus("APPROVED");
        return repo.save(job);
    }

    @PutMapping("/reject/{id}")
    public Object rejectJob(@PathVariable int id) {
        Job job = repo.findById(id).orElse(null);

        if (job == null) {
            return "Job not found";
        }

        job.setStatus("REJECTED");
        return repo.save(job);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteJob(@PathVariable int id) {
        repo.deleteById(id);
        return "Job deleted successfully";
    }
}