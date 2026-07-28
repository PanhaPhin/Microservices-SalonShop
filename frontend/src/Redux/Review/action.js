import api from "../../config/api";
import {
  CREATE_REVIEW_FAILED,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAILED,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  FETCH_REVIEWS_FAILED,
  FETCH_REVIEWS_REQUEST,
  FETCH_REVIEWS_SUCCESS,
  UPDATE_REVIEW_FAILED,
  UPDATE_REVIEW_REQUEST,
  UPDATE_REVIEW_SUCCESS,
} from "./actionTypes";

// Fetch Reviews
export const fetchReviews =
  ({ salonId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: FETCH_REVIEWS_REQUEST });

    try {
      const response = await api.get(`/api/reviews/salon/${salonId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("fetch reviews: ", response.data);
      dispatch({ type: FETCH_REVIEWS_SUCCESS, payload: response.data });
    } catch (error) {
      console.log("error fetching review:", error);
      dispatch({ type: FETCH_REVIEWS_FAILED, payload: error.message });
    }
  };

// Create Review
export const createReview =
  ({ salonId, reviewData, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_REVIEW_REQUEST });

    try {
      const response = await api.post(
        `/api/reviews/salon/${salonId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("created review: ", response.data);
      dispatch({ type: CREATE_REVIEW_SUCCESS, payload: response.data });
    } catch (error) {
      console.log("error creating review: ", error);
      dispatch({ type: CREATE_REVIEW_FAILED, payload: error.message });
    }
  };

// Update Review
export const updateReview =
  ({ reviewId, reviewData, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_REVIEW_REQUEST });

    try {
      const response = await api.put(
        `/api/reviews/${reviewId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("updated review: ", response.data);
      dispatch({ type: UPDATE_REVIEW_SUCCESS, payload: response.data });
    } catch (error) {
      console.log("error updating review: ", error);
      dispatch({ type: UPDATE_REVIEW_FAILED, payload: error.message });
    }
  };

// Delete Review
export const deleteReview =
  ({ reviewId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    try {
      await api.delete(`/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("deleted review: ", reviewId);
      dispatch({ type: DELETE_REVIEW_SUCCESS, payload: reviewId });
    } catch (error) {
      console.log("error deleting review: ", error);
      dispatch({ type: DELETE_REVIEW_FAILED, payload: error.message });
    }
  };