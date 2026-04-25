CREATE DATABASE IF NOT EXISTS government_job_system;

USE government_job_system;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150),
    category VARCHAR(100),
    eligibility VARCHAR(200),
    exam_date DATE,
    deadline DATE,
    description TEXT,
    status VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    job_id INT,
    application_status VARCHAR(50),
    applied_date DATE
);

INSERT INTO users(name,email,password,role)
VALUES('Admin','admin@gmail.com','admin123','ADMIN');

INSERT INTO jobs(title, category, eligibility, exam_date, deadline, description, status)
VALUES
('Junior Assistant', 'State Government', 'Any Degree', '2026-06-10', '2026-05-20', 'Government junior assistant post with written exam.', 'APPROVED'),
('Police Constable', 'Police Department', 'Intermediate / 12th Pass', '2026-07-05', '2026-06-10', 'Police constable recruitment notification.', 'APPROVED'),
('Railway Technician', 'Railway', 'ITI / Diploma', '2026-08-15', '2026-07-01', 'Railway technician recruitment notification.', 'APPROVED');