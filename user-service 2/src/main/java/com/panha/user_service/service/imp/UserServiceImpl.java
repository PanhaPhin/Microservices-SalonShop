package com.panha.user_service.service.imp;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.panha.user_service.exception.UserException;
import com.panha.user_service.modal.User;
import com.panha.user_service.repository.UserRepository;
import com.panha.user_service.service.KeycloakService;
import com.panha.user_service.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    // Constructor injection for Spring
    public UserServiceImpl(UserRepository userRepository, KeycloakService keycloakService) {
        this.userRepository = userRepository;
        this.keycloakService = keycloakService;
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) throws UserException {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserException("User not found with id " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) throws UserException {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    @Override
    public User updateUser(Long id, User user) throws UserException {
        User existingUser = getUserById(id);

        existingUser.setFullName(user.getFullName());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());
        existingUser.setUsername(user.getUsername());
        existingUser.setPhone(user.getPhone());
        existingUser.setPassword(user.getPassword());

        return userRepository.save(existingUser);
    }

    @Override
    public User getUserFromJwt(String jwt) throws Exception {

        String[] parts = jwt.split("\\.");

        if (parts.length != 3) {
            throw new RuntimeException("Invalid JWT token");
        }

        String payload = new String(
                java.util.Base64.getDecoder().decode(parts[1])
        );

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> data
                = mapper.readValue(payload, Map.class);

        String email = (String) data.get("email");

        if (email == null) {
            throw new RuntimeException("Email not found in token");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(()
                        -> new UserException("User not found with email " + email)
                );
    }
}
