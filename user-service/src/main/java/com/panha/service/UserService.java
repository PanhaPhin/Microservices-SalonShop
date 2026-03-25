package com.panha.service;

import java.util.List;

import com.panha.exception.UserException;
import com.panha.modal.User;

public interface UserService {
    User createUser (User user);
    User getUserById(Long id) throws Exception;
    List<User> getAllUsers();
    void deleteUser(Long id) throws UserException, Exception;
    User updateUser(Long id , User user) throws UserException, Exception;
    
}
