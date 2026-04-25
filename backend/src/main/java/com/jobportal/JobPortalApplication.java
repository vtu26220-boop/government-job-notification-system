package com.jobportal;

import com.jobportal.entity.Job;
import com.jobportal.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class JobPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobPortalApplication.class, args);
    }

    @Bean
    CommandLineRunner addSampleJobs(JobRepository jobRepository) {
        return args -> {

            System.out.println("======== INSERTING SAMPLE JOBS STARTED ========");

            jobRepository.deleteAll();

            jobRepository.save(createJob("Electrician", "Technical", "ITI / Diploma", "Electric work job"));
            jobRepository.save(createJob("Software Developer", "IT", "B.Tech / MCA", "Software developer job"));
            jobRepository.save(createJob("Office Clerk", "Government", "Any Degree", "Office work job"));
            jobRepository.save(createJob("Data Entry Operator", "Computer", "Any Degree", "Data entry job"));
            jobRepository.save(createJob("Police Constable", "Police", "12th Pass", "Police department job"));
            jobRepository.save(createJob("Railway Technician", "Railway", "ITI / Diploma", "Railway technician job"));
            jobRepository.save(createJob("Bank Assistant", "Banking", "Any Degree", "Bank assistant job"));
            jobRepository.save(createJob("Teacher", "Education", "B.Ed", "Government teacher job"));
            jobRepository.save(createJob("Nurse", "Healthcare", "Nursing", "Hospital nurse job"));
            jobRepository.save(createJob("Driver", "Transport", "Driving License", "Government driver job"));

            System.out.println("TOTAL JOBS SAVED = " + jobRepository.count());
            System.out.println("======== INSERTING SAMPLE JOBS FINISHED ========");
        };
    }

    private Job createJob(String title, String category, String eligibility, String description) {
        Job job = new Job();
        job.setTitle(title);
        job.setCategory(category);
        job.setEligibility(eligibility);
        job.setExamDate(LocalDate.of(2026, 5, 20));
        job.setDeadline(LocalDate.of(2026, 6, 15));
        job.setDescription(description);
        job.setStatus("APPROVED");
        return job;
    }
}