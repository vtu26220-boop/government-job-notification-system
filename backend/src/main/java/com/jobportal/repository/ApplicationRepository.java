package com.jobportal.repository;

import com.jobportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<JobApplication, Integer> {
    List<JobApplication> findByUserId(int userId);
    boolean existsByUserIdAndJobId(int userId, int jobId);
}