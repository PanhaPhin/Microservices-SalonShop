
import axios from "axios";
import{ API_BASE_URL } from "../../config/api";

import {
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,

    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,

    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,

    LOGOUT,
} from "./actionTypes";
import Swal from "sweetalert2";


export const registerUser = (userData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    console.log("auth action - ", userData);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/signup`,
            userData.data
        );

        const user = response.data;

        dispatch({
            type: REGISTER_SUCCESS,
            payload: user,
        });

        // ✅ Success popup
        Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "Your account has been created successfully.",
            timer: 1500,
            showConfirmButton: false,
        });

        if (user?.jwt) {
            localStorage.setItem("jwt", user.jwt);
        }

        userData.navigate("/");

    } catch (error) {
        console.log("error", error);

        dispatch({
            type: REGISTER_FAILURE,
            payload: error,
        });

        // ❌ Error popup
        Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text:
                error.response?.data?.message ||
                "Unable to register. Please try again.",
        });
    }
};

const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user })

export const loginUser = (userData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/login`,
            userData.data
        );

        const user = response.data;

        console.log("login", user);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: user,
        });



        // ✅ Success popup
        Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome back!",
            timer: 1500,
            showConfirmButton: false,
        });

        if (user.jwt) {
            localStorage.setItem("jwt", user.jwt);

            if (user.role === "ROLE_ADMIN") {
                userData.navigate("/admin");
            } else if (user.role === "ROLE_SALON_OWNER") {
                userData.navigate("/salon-dashboard");
            } else {
                userData.navigate("/");
            }
        }

    } catch (error) {
        console.log("error", error);

        dispatch({
            type: LOGIN_FAILURE,
            payload: error
        });

        // ❌ Error popup
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: error.response?.data?.message || "Invalid email or password.",
        });
    }
};

export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data;
      dispatch({ type: GET_USER_SUCCESS, payload: user });
    } catch (error) {
      dispatch({ type: GET_USER_FAILURE, payload: error });
    }
  };
};


export const logout = () => {
    return async (dispatch) => {
        dispatch({ type: LOGOUT });
        localStorage.clear();
    }
}


