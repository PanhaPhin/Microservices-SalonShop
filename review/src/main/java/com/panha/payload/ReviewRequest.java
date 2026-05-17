package com.panha.payload;

import lombok.Data;

@Data
public class ReviewRequest {

    private String reviewText;
    private Integer rating;

}
