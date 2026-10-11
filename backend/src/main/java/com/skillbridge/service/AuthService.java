package com.skillbridge.service;

import com.skillbridge.dto.AuthRequest;
import com.skillbridge.dto.AuthResponse;
import com.skillbridge.dto.RegisterRequest;
import com.skillbridge.entity.User;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCollege(request.getCollege());
        user.setDepartment(request.getDepartment());
        user.setAcademicYear(request.getAcademicYear());
        user.setRole("ROLE_STUDENT");
        user.setBio("Student ready to share and learn skills!");
        user.setAvatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getName().replace(" ", ""));

        User saved = userRepository.save(user);

        var userDetails = userDetailsService.loadUserByUsername(saved.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                saved.getUserId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole(),
                saved.getCollege(),
                saved.getDepartment(),
                saved.getAcademicYear(),
                saved.getBio(),
                saved.getAvatarUrl()
        );
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCollege(),
                user.getDepartment(),
                user.getAcademicYear(),
                user.getBio(),
                user.getAvatarUrl()
        );
    }
}
