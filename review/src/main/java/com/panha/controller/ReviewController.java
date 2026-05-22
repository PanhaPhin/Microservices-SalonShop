package com.panha.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.panha.payload.SalonDTO;
import com.panha.model.Review;
import com.panha.payload.ApiResponse;
import com.panha.payload.ReviewRequest;
import com.panha.payload.UserDTO;
import com.panha.service.ReviewService;
import com.panha.service.client.SalonFeignClient;
import com.panha.service.client.UserFeignClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserFeignClient userFeignClient;
    private final SalonFeignClient salonFeignClient;

    @PostMapping("/salon/{salonId}")
    public ResponseEntity<Review> createReview(
            @PathVariable long salonId,
            @RequestBody ReviewRequest req,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        SalonDTO salon = salonFeignClient.getSalonById(salonId).getBody();

        Review review = reviewService.createReview(req, user, salon);

        return ResponseEntity.ok(review);

    }

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<Review>> getReviewsBySalonId(
            @PathVariable long salonId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        SalonDTO salon = salonFeignClient.getSalonById(salonId).getBody();

        List<Review> reviews = reviewService.getReviewsBySalonId(salon.getId());

        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable long reviewId,
            @RequestBody ReviewRequest req,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();

        Review review = reviewService.updateReview(
                req,
                reviewId,
                user.getId()
        );

        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable long reviewId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();


        reviewService.deleteReview(
                reviewId,
                user.getId()
        );

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Review deleted successfully");

        return ResponseEntity.ok(apiResponse);
    }

}
