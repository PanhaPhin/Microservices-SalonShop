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

const initialState = {
  loading: false,
  success: null,
  error: null,
};

export const proceedPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROCEED_PAYMENT_REQUEST:
      return { ...state, loading: true, success: null, error: null };
    case PROCEED_PAYMENT_SUCCESS:
      return { ...state, loading: false, success: action.payload, error: null };
    case PROCEED_PAYMENT_FAILURE:
      return { ...state, loading: false, success: null, error: action.payload };
    default:
      return state;
  }
};

export const bakongPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_BAKONG_PAYMENT_REQUEST:
      return { ...state, loading: true, success: null, error: null };
    case INITIATE_BAKONG_PAYMENT_SUCCESS:
      return { ...state, loading: false, success: action.payload, error: null };
    case INITIATE_BAKONG_PAYMENT_FAILURE:
      return { ...state, loading: false, success: null, error: action.payload };
    default:
      return state;
  }
};

export const stripePaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_STRIPE_PAYMENT_REQUEST:
      return { ...state, loading: true, success: null, error: null };
    case INITIATE_STRIPE_PAYMENT_SUCCESS:
      return { ...state, loading: false, success: action.payload, error: null };
    case INITIATE_STRIPE_PAYMENT_FAILURE:
      return { ...state, loading: false, success: null, error: action.payload };
    default:
      return state;
  }
};