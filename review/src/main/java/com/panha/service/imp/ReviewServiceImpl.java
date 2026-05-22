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
       return reviewRepository.findBySalonId(salonId);
    }

    private Review getReviewById(Long id) throws Exception{
        return reviewRepository.findById(id).orElseThrow(
            ()-> new Exception("review not exist ... ")
        );
    }



    @Override
    public Review updateReview(ReviewRequest req, Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if(!review.getUserId().equals(userId)){

            throw new Exception("you are not the owner of this review ...");
        }

        review.setReviewText(req.getReviewText());
        review.setRating(req.getRating());
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if(!review.getUserId().equals(userId)){
            throw new Exception("you are not the owner of this review ...");
        }
        reviewRepository.delete(review);
    }

}
