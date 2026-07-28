import {
  INITIATE_BAKONG_PAYMENT_REQUEST,
  INITIATE_BAKONG_PAYMENT_SUCCESS,
  INITIATE_BAKONG_PAYMENT_FAILURE,
  INITIATE_STRIPE_PAYMENT_REQUEST,
  INITIATE_STRIPE_PAYMENT_SUCCESS,
  INITIATE_STRIPE_PAYMENT_FAILURE,
  PROCEED_PAYMENT_REQUEST,
  PROCEED_PAYMENT_SUCCESS,
  PROCEED_PAYMENT_FAILURE,
} from "./actionTypes";
import api from "../../config/api";

export const initiateBakongPayment =
  ({ amount, currency = "KHR", jwt }) =>
  async (dispatch) => {
    dispatch({ type: INITIATE_BAKONG_PAYMENT_REQUEST });

    try {
      const { data } = await api.post(
        "/api/payments/khqr",
        { amount, currency },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      dispatch({ type: INITIATE_BAKONG_PAYMENT_SUCCESS, payload: data });
      return data;
    } catch (error) {
      const message = error.response ? error.response.data : error.message;
      dispatch({ type: INITIATE_BAKONG_PAYMENT_FAILURE, payload: message });
    }
  };

export const initiateStripePayment =
  ({ amount, currency = "usd", jwt }) =>
  async (dispatch) => {
    dispatch({ type: INITIATE_STRIPE_PAYMENT_REQUEST });

    try {
      const { data } = await api.post(
        "/api/payments/stripe/create-intent",
        { amount, currency },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      dispatch({ type: INITIATE_STRIPE_PAYMENT_SUCCESS, payload: data });
      return data;
    } catch (error) {
      const message = error.response ? error.response.data : error.message;
      dispatch({ type: INITIATE_STRIPE_PAYMENT_FAILURE, payload: message });
    }
  };

export const paymentSuccess =
  ({ paymentId, paymentLinkId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: PROCEED_PAYMENT_REQUEST });

    try {
      const { data } = await api.patch("/api/payments/proceed", null, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { paymentId, paymentLinkId },
      });

      dispatch({ type: PROCEED_PAYMENT_SUCCESS, payload: data });
      return data;
    } catch (error) {
      const message = error.response ? error.response.data : error.message;
      dispatch({ type: PROCEED_PAYMENT_FAILURE, payload: message });
    }
  };