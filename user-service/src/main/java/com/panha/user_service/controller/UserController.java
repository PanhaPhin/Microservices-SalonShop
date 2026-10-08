package com.panha.user_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.panha.user_service.modal.User;
import com.panha.user_service.payload.dto.StatusUpdateRequest;
import com.panha.user_service.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/api/users")
    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
        return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }

    @GetMapping("/api/users/profile")
    public ResponseEntity<?> getUserProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        try {

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);

            if (token.isBlank()) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            User user = userService.getUserFromJwt(token);

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }
    }


    //add new
    @PatchMapping("/api/users/me/become-salon-owner")
    public ResponseEntity<?> becomeSalonOwner(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authHeader
    ) {

        try {

            if (authHeader == null
                    || !authHeader.startsWith("Bearer ")) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                "Missing or invalid Authorization header"
                        );
            }

            String token = authHeader.substring(7);

            if (token.isBlank()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid token");
            }

            User user =
                    userService.becomeSalonOwner(token);

            return ResponseEntity.ok(user);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }



    @GetMapping("/api/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) throws Exception {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping("/api/users/batch")
    public ResponseEntity<List<User>> getUsersByIds(@RequestParam("ids") List<Long> ids) {
        return ResponseEntity.ok(userService.getUsersByIds(ids));
    }

    @PutMapping("/api/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
            @RequestBody User user) throws Exception {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @PatchMapping("/api/users/{id}/status")
    public ResponseEntity<User> updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid StatusUpdateRequest req) throws Exception {
        return ResponseEntity.ok(userService.updateBlockedStatus(id, req.getBlocked()));
    }

    

    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) throws Exception {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }
}
