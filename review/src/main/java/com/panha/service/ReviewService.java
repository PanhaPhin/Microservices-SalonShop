package com.panha.service;

import java.util.List;

import com.panha.model.Review;
import com.panha.payload.ReviewRequest;
import com.panha.payload.SalonDTO;
import com.panha.payload.UserDTO;

public interface ReviewService {

    Review createReview(
        ReviewRequest req,
        UserDTO user,
        SalonDTO salon
    );

    List<Review> getReviewsBySalonId(Long salonId);

    Review updateReview(ReviewRequest req, Long reviewId, Long userId);

    void deleteReview(Long reviewId, Long userId);
}

