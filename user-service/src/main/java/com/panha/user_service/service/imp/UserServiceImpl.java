package com.panha.user_service.service.imp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.panha.user_service.domain.Platform;
import com.panha.user_service.domain.UserRole;
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
        // existingUser.setRole(user.getRole());
        existingUser.setUsername(user.getUsername());
        existingUser.setPhone(user.getPhone());

        if (user.getPassword() != null
                && !user.getPassword().isBlank()) {
            existingUser.setPassword(user.getPassword());
        }

        existingUser.setUpdatedAt(LocalDateTime.now());

        // existingUser.setPassword(user.getPassword());
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

    @Override
    public User updateBlockedStatus(Long id, boolean blocked) throws UserException {
        User existingUser = getUserById(id);
        existingUser.setBlocked(blocked);
        return userRepository.save(existingUser);
    }

    @Override
    public List<User> getUsersByIds(List<Long> ids) {
        return userRepository.findAllById(ids);
    }

    @Override
    public User recordActivity(Long id, Platform platform) throws UserException, Exception {
        User user = getUserById(id);
        user.setLastActivePlatform(platform);
        user.setLastActiveAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public User becomeSalonOwner(String token) throws Exception {

        User user = getUserFromJwt(token);

        if (user.getRole() == UserRole.SALON_OWNER) {
            return user;
        }

        if (user.getRole() != UserRole.CUSTOMER) {

            throw new UserException(
                    "Only CUSTOMER accounts can become SALON_OWNER"
            );
        }

        if (user.getKeycloakId() == null
                || user.getKeycloakId().isBlank()) {

            throw new UserException(
                    "Keycloak ID not found for this user"
            );
        }

        // 5. Update MySQL role
        user.setRole(UserRole.SALON_OWNER);
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // 6. Update Keycloak role
        keycloakService.addSalonOwnerRole(
                user.getKeycloakId()
        );

        return savedUser;

    }
}
