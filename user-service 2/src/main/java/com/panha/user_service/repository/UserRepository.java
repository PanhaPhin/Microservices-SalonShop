package com.panha.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panha.user_service.modal.User;

public interface  UserRepository extends JpaRepository<User, Long> {
    
}
