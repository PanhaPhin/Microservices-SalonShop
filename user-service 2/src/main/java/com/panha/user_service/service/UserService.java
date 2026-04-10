package com.panha.user_service.service;

import com.panha.user_service.modal.User;
import java.util.List;
import com.panha.user_service.exception.UserException;

public interface UserService {
    User createUser (User user);
    User getUserById(Long id) throws Exception;
    List<User> getAllUsers();
    void deleteUser(Long id) throws UserException, Exception;
    User updateUser(Long id , User user) throws UserException, Exception;
    
}
