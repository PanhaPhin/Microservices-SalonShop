package com.panha.modal;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullName;

    @NotBlank(message = "username is mandatory")
    private String username;

    @NotBlank(message = "email is mandatory")
    @Email(message = "Email should be valid")
    private String email;

    private String phone;

    @NotBlank(message = "role is mandatory")
    private String role;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @CreationTimestamp
    private LocalDateTime updatedAt;

    @NotBlank(message = "password is mandatory")
    private String password;

    // Optional: convenience method
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}