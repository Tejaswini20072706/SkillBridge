-- SkillBridge MySQL Database Schema Definition
CREATE DATABASE IF NOT EXISTS skillbridge_db;
USE skillbridge_db;

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    college VARCHAR(150),
    department VARCHAR(100),
    academic_year VARCHAR(50),
    bio TEXT,
    avatar_url VARCHAR(255),
    role VARCHAR(50) DEFAULT 'ROLE_STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SKILLS
CREATE TABLE IF NOT EXISTS skills (
    skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT
);

-- 3. USER_SKILLS
CREATE TABLE IF NOT EXISTS user_skills (
    user_skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency VARCHAR(50) NOT NULL, -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    type VARCHAR(50) NOT NULL,        -- TEACH, LEARN, BOTH
    experience_details TEXT,
    CONSTRAINT fk_userskill_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_userskill_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    CONSTRAINT uq_user_skill UNIQUE (user_id, skill_id, type)
);

-- 4. AVAILABILITY
CREATE TABLE IF NOT EXISTS availability (
    availability_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL, -- MONDAY, TUESDAY, etc.
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    CONSTRAINT fk_availability_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 5. MENTORING_REQUESTS
CREATE TABLE IF NOT EXISTS mentoring_requests (
    request_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    learner_id BIGINT NOT NULL,
    mentor_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED, CANCELLED, COMPLETED
    message TEXT,
    preferred_date_time VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_req_learner FOREIGN KEY (learner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_req_mentor FOREIGN KEY (mentor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_req_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- 6. SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
    session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL UNIQUE,
    scheduled_at VARCHAR(100) NOT NULL,
    duration INT NOT NULL, -- minutes (e.g., 45, 60)
    mode VARCHAR(50) NOT NULL, -- ONLINE, OFFLINE
    meeting_link_or_location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_req FOREIGN KEY (request_id) REFERENCES mentoring_requests(request_id) ON DELETE CASCADE
);

-- 7. FEEDBACK
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    target_user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_session FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_target FOREIGN KEY (target_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 8. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
