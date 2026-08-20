package com.panha.user_service.service;

import java.util.List;

import com.panha.user_service.domain.Platform;
import com.panha.user_service.exception.UserException;
import com.panha.user_service.modal.User;

public interface UserService {
    User createUser (User user);
    User getUserById(Long id) throws Exception;
    List<User> getAllUsers();

    List<User> getUsersByIds(List<Long> ids);

    void deleteUser(Long id) throws UserException, Exception;
    User updateUser(Long id , User user) throws UserException, Exception;
    User getUserFromJwt(String token) throws Exception;
    User updateBlockedStatus(Long id, boolean blocked) throws UserException, Exception;
    User recordActivity(Long id, Platform platform) throws UserException, Exception;
}
