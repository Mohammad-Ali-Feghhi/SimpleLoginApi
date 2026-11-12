package com.example.simpleloginapi.service;

import com.example.simpleloginapi.dto.*;
import com.example.simpleloginapi.entity.User;
import com.example.simpleloginapi.exception.DuplicateUserNameException;
import com.example.simpleloginapi.exception.InvalidLoginException;
import com.example.simpleloginapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.simpleloginapi.exception.UserNotFoundException;
import com.example.simpleloginapi.service.JwtService;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    public List<UserResponse> getAllUsers() {
        //return userRepository.findAll();
        return userRepository.findAll()
                             .stream()
                             .map(this::mapToResponse)
                             .toList();
    }

    public UserResponse createUser(UserRequest request) {
        if(userRepository.existsByUserName(request.getUserName())) {
            throw new DuplicateUserNameException("نام کاربری تکراری است!");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUserName(request.getUserName());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    public UserResponse getUserById(int userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found")
                );

        return mapToResponse(user);
    }
    public UserResponse updateUser(int id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found")
                );

        Optional<User> existingUser = userRepository.findByUserName(request.getUserName());
        if(existingUser.isPresent() && existingUser.get().getUserId() != id) {
            throw new DuplicateUserNameException("نام کاربری تکراری است!");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUserName(request.getUserName());


        User updateUser = userRepository.save(user);
        return mapToResponse(updateUser);
    }

    public void deleteUser(int userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found")
                );

        userRepository.delete(user);
    }

    public AuthResponse login(String userName, String password) {

        User user =
                userRepository.findByUserName(userName)
                        .orElseThrow(() ->
                                new InvalidLoginException(
                                        "نام کاربری یا رمز عبور اشتباه است."
                                )
                        );


        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );


        if (!passwordMatches) {

            throw new InvalidLoginException(
                    "نام کاربری یا رمز عبور اشتباه است."
            );
        }


        String token =
                jwtService.generateToken(
                        user.getUserName()
                );


        return new AuthResponse(token);
    }

    public void changePassword(String userName, ChangePasswordRequest request) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("کاربر یافت نشد!"));

        if(!passwordEncoder.matches(request.getCurrentPassword(),
                user.getPassword())) {
            throw new RuntimeException("رمز عبور فعلی اشتباه است!");
        }

        if(!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("رمز عبور جدید و تکرار آن یکسان نیستند!");
        }

        if(passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد!");
        }

        if(!isValidPassword(request.getNewPassword())) {
            throw new RuntimeException(
                    "رمز عبور باید حداقل شامل یک حرف بزرگ، یک حرف کوچک، یک عدد و یک کاراکتر خاص باشد.");
        }

        if(!isValidSize(request.getNewPassword())) {
            throw new RuntimeException("رمز عبور باید بین 8 تا 100 کاراکتر باشد.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setUserName(user.getUserName());
        return response;
    }

    private boolean isValidPassword(String password) {

        return password.matches(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).+$"
        );
    }

    private boolean isValidSize(String password) {
        return password.length() < 8 || password.length() > 100;
    }
}
