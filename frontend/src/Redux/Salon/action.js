import api from "../../config/api";

import {
  CREATE_SALON_REQUEST,
  CREATE_SALON_SUCCESS,
  CREATE_SALON_FAILURE,

  UPDATE_SALON_REQUEST,
  UPDATE_SALON_SUCCESS,
  UPDATE_SALON_FAILURE,

  FETCH_SALONS_REQUEST,
  FETCH_SALONS_SUCCESS,
  FETCH_SALONS_FAILURE,

  FETCH_SALON_BY_ID_REQUEST,
  FETCH_SALON_BY_ID_SUCCESS,
  FETCH_SALON_BY_ID_FAILURE,

  FETCH_SALON_BY_OWNER_REQUEST,
  FETCH_SALON_BY_OWNER_SUCCESS,
  FETCH_SALON_BY_OWNER_FAILURE,

  SEARCH_SALONS_REQUEST,
SEARCH_SALONS_SUCCESS,
SEARCH_SALONS_FAILURE,
} from "./actionTypes";


const API_BASE_URL = "/api/salons";

// Create Salon
export const createSalon =
  ({ reqData }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_SALON_REQUEST });

    try {
      const jwt = localStorage.getItem("jwt");

      const response = await api.post(
        API_BASE_URL,
        reqData.salonDetails,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      dispatch({
        type: CREATE_SALON_SUCCESS,
        payload: response.data,
      });

      if (reqData.navigate) {
        reqData.navigate("/salon-dashboard");
      }
    } catch (error) {
      dispatch({
        type: CREATE_SALON_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Update Salon
export const updateSalon =
  ({ salonId, salon, jwt, navigate }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_SALON_REQUEST });

    try {
      const response = await api.put(
        `${API_BASE_URL}/${salonId}`,
        salon,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      dispatch({
        type: UPDATE_SALON_SUCCESS,
        payload: response.data,
      });

      if (navigate) {
        navigate("/salon-dashboard");
      }
    } catch (error) {
      dispatch({
        type: UPDATE_SALON_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };


// Fetch All Salons
export const fetchSalons = () => async (dispatch) => {

  dispatch({
    type: FETCH_SALONS_REQUEST
  });

  try {

    const response = await api.get(
      API_BASE_URL,
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );


    dispatch({
      type: FETCH_SALONS_SUCCESS,
      payload: response.data,
    });


  } catch(error) {

    dispatch({
      type: FETCH_SALONS_FAILURE,
      payload:error.response?.data?.message || error.message,
    });

  }

};

console.log("Salons")

export const fetchSalonById = (salonId) => async (dispatch) => {
  dispatch({ type: FETCH_SALON_BY_ID_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/${salonId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    dispatch({ type: FETCH_SALON_BY_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: FETCH_SALON_BY_ID_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Fetch Salon By Owner
export const fetchSalonByOwner =
  (jwt) =>
  async (dispatch) => {
    dispatch({ type: FETCH_SALON_BY_OWNER_REQUEST });

    try {
      const response = await api.get(
        `${API_BASE_URL}/owner`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      dispatch({
        type: FETCH_SALON_BY_OWNER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_SALON_BY_OWNER_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Search Salons
export const searchSalons =
  (jwt, city) =>
  async (dispatch) => {

    dispatch({
      type: SEARCH_SALONS_REQUEST
    });

    try {

      const response = await api.get(
        `${API_BASE_URL}/search`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            city,
          },
        }
      );

      dispatch({
        type: SEARCH_SALONS_SUCCESS,
        payload: response.data,
      });

    } catch (error) {

      dispatch({
        type: SEARCH_SALONS_FAILURE,
        payload: error.response?.data?.message || error.message,
      });

    }
  };