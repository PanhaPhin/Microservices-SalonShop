package com.panha.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.panha.model.Review;
import com.panha.payload.ReviewRequest;
import com.panha.payload.SalonDTO;
import com.panha.payload.UserDTO;
import com.panha.repository.ReviewRepository;
import com.panha.service.ReviewService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public Review createReview(ReviewRequest req, UserDTO user, SalonDTO salon) {
        
        Review review = new Review();
        review.setReviewText(req.getReviewText());
        review.setRating(req.getRating());
        review.setUserId(user.getId());
        review.setSalonId(salon.getId());

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsBySalonId(Long salonId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getReviewsBySalonId'");
    }

    @Override
    public Review updateReview(ReviewRequest req, Long reviewId, Long userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateReview'");
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteReview'");
    }

}
