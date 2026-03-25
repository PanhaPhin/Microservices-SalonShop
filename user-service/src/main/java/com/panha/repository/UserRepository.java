package com.panha.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.panha.modal.User;

public interface  UserRepository extends JpaRepository<User, Long> {
    
}
