import api from "../../config/api";

import {
  CREATE_SERVICE_REQUEST,
  CREATE_SERVICE_SUCCESS,
  CREATE_SERVICE_FAILURE,

  UPDATE_SERVICE_REQUEST,
  UPDATE_SERVICE_SUCCESS,
  UPDATE_SERVICE_FAILURE,

  FETCH_SERVICES_BY_SALON_REQUEST,
  FETCH_SERVICES_BY_SALON_SUCCESS,
  FETCH_SERVICES_BY_SALON_FAILURE,

  FETCH_SERVICE_BY_ID_REQUEST,
  FETCH_SERVICE_BY_ID_SUCCESS,
  FETCH_SERVICE_BY_ID_FAILURE,
} from "./actionTypes";

const API_BASE_URL = "/api/service-offering";

// =========================
// Create Service
// =========================
export const createServiceAction =
  ({ service, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_SERVICE_REQUEST });

    try {
      const { data } = await api.post(
        `${API_BASE_URL}/salon-owner`,
        service,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("Service created:", data);

      dispatch({
        type: CREATE_SERVICE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log("Error creating service:", error);

      dispatch({
        type: CREATE_SERVICE_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// =========================
// Update Service
// =========================
export const updateService =
  ({ serviceId, service, jwt }) =>
  async (dispatch) => {
    dispatch({
      type: UPDATE_SERVICE_REQUEST,
    });

    try {
      const { data } = await api.put(
        `${API_BASE_URL}/${serviceId}`,
        service,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      dispatch({
        type: UPDATE_SERVICE_SUCCESS,
        payload: data,
      });

      console.log("Service updated:", data);
    } catch (error) {
      dispatch({
        type: UPDATE_SERVICE_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// =========================
// Fetch Services By Salon
// =========================
export const fetchServiceBySalonId =
  ({ salonId, jwt, categoryId }) =>
  async (dispatch) => {
    dispatch({
      type: FETCH_SERVICES_BY_SALON_REQUEST,
    });

    try {
      const { data } = await api.get(
        `${API_BASE_URL}/salon/${salonId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            categoryId,
          },
        }
      );

      dispatch({
        type: FETCH_SERVICES_BY_SALON_SUCCESS,
        payload: data,
      });

      return data;
    } catch (error) {
      dispatch({
        type: FETCH_SERVICES_BY_SALON_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// =========================
// Fetch Service By Id
// =========================
export const fetchServiceById =
  (serviceId) =>
  async (dispatch) => {
    dispatch({
      type: FETCH_SERVICE_BY_ID_REQUEST,
    });

    try {
      const { data } = await api.get(
        `${API_BASE_URL}/${serviceId}`
      );

      dispatch({
        type: FETCH_SERVICE_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_SERVICE_BY_ID_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };