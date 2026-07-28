package com.panha.mapper;

import com.panha.model.Review;
import com.panha.payload.UserDTO;
import com.panha.payload.dto.ReviewDTO;

public class ReviewMapper {

    public static ReviewDTO toDTO(Review review, UserDTO user) {

        ReviewDTO reviewDTO = new ReviewDTO();

        reviewDTO.setId(review.getId());
        reviewDTO.setReviewText(review.getReviewText());
        reviewDTO.setRating(review.getRating());          // Fixed
        reviewDTO.setUser(user);
        reviewDTO.setCreatedAt(review.getCreatedAt());    // Fixed

        return reviewDTO;
    }
}