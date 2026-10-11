-- Insert default demo skills
INSERT IGNORE INTO skills (skill_id, skill_name, category, description) VALUES
(1, 'Java & Spring Boot', 'Software Engineering', 'Enterprise backend web development and REST APIs'),
(2, 'React.js & Frontend', 'Web Development', 'Modern component-driven web UI with state and hooks'),
(3, 'Python & Machine Learning', 'Data Science', 'Data analysis, pandas, numpy, and machine learning models'),
(4, 'UI/UX Design & Figma', 'Design', 'Wireframing, prototyping, user journey mapping, and visual design'),
(5, 'Data Structures & Algorithms', 'Computer Science', 'Arrays, graphs, dynamic programming, and problem solving'),
(6, 'Cloud Computing (AWS/GCP)', 'DevOps & Cloud', 'Cloud architecture, Docker containers, and CI/CD');

-- Insert demo users (password: 'password123')
-- BCrypt for 'password123': $2a$10$r9x8OQ6cKqR1yXj8J9S2u.0j8m2c6s4H1gA0f8y7H8d8s7A6f5G4C
INSERT IGNORE INTO users (user_id, name, email, password, college, department, academic_year, bio, avatar_url, role) VALUES
(1, 'Aarav Sharma', 'aarav@example.com', '$2a$10$r9x8OQ6cKqR1yXj8J9S2u.0j8m2c6s4H1gA0f8y7H8d8s7A6f5G4C', 'MIT College of Engineering', 'Computer Science', '3rd Year', 'Passionate full-stack developer eager to mentor in Java/Spring and learn modern UI/UX design.', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', 'ROLE_STUDENT'),
(2, 'Priya Patel', 'priya@example.com', '$2a$10$r9x8OQ6cKqR1yXj8J9S2u.0j8m2c6s4H1gA0f8y7H8d8s7A6f5G4C', 'National Institute of Tech', 'Information Technology', '4th Year', 'Figma specialist and frontend enthusiast with 2 years of freelance experience.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'ROLE_STUDENT'),
(3, 'Rohan Verma', 'rohan@example.com', '$2a$10$r9x8OQ6cKqR1yXj8J9S2u.0j8m2c6s4H1gA0f8y7H8d8s7A6f5G4C', 'State Engineering College', 'AI & Data Science', '2nd Year', 'Python enthusiast working on NLP models. Looking to learn backend system design.', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', 'ROLE_STUDENT');

-- Insert User Skills
INSERT IGNORE INTO user_skills (user_skill_id, user_id, skill_id, proficiency, type, experience_details) VALUES
(1, 1, 1, 'ADVANCED', 'TEACH', '2 years of building REST APIs and microservices with Spring Boot'),
(2, 1, 4, 'BEGINNER', 'LEARN', 'Want to master design systems and interactive prototyping in Figma'),
(3, 2, 4, 'EXPERT', 'TEACH', 'Built over 15 client designs and university web portals'),
(4, 2, 1, 'INTERMEDIATE', 'LEARN', 'Know core Java, wanting to learn Spring Data and Security'),
(5, 3, 3, 'ADVANCED', 'TEACH', 'Built neural nets and scikit-learn recommendation algorithms'),
(6, 3, 2, 'BEGINNER', 'LEARN', 'Need React skills to visualize AI dashboards');

-- Insert User Availability
INSERT IGNORE INTO availability (availability_id, user_id, day_of_week, start_time, end_time) VALUES
(1, 1, 'MONDAY', '16:00', '18:00'),
(2, 1, 'WEDNESDAY', '17:00', '19:00'),
(3, 2, 'TUESDAY', '14:00', '16:00'),
(4, 2, 'SATURDAY', '10:00', '13:00'),
(5, 3, 'FRIDAY', '15:00', '18:00');
