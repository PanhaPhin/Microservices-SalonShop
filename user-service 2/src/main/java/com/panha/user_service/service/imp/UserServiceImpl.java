package com.panha.user_service.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.panha.user_service.exception.UserException;
import com.panha.user_service.modal.User;
import com.panha.user_service.repository.UserRepository;
import com.panha.user_service.service.UserService;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // Constructor injection for Spring
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
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
        existingUser.updateTimestamp();

        return userRepository.save(existingUser);
    }
}