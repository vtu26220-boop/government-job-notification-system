package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByStatus(String status);
    List<Job> findByCategoryContainingIgnoreCase(String category);
    List<Job> findByTitleContainingIgnoreCase(String title);
}