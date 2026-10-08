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

    GET_ALL_CUSTOMER_REQUEST,
    GET_ALL_CUSTOMER_SUCCESS,
    GET_ALL_CUSTOMER_FAILURE,

    LOGOUT
} from "./actionTypes";


const initialState = {
    user: null,
    jwt: null,
    customers: [],
    isLoading: false,
    fetchingUser: false,
    authInitialized: false,
    error: null,
};


const authReducer = (state = initialState, action) => {

    switch (action.type) {

        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_ALL_CUSTOMER_REQUEST:

            return {
                ...state,
                isLoading: true,
                error: null
            };


        case GET_USER_REQUEST:
            return {
                ...state,
                fetchingUser: true,
                authInitialized: false,
                error: null
            };


        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:

            return {
                ...state,
                isLoading: false,
                user: action.payload,
                jwt: action.payload?.jwt || null,
                error: null
            };


        case GET_USER_SUCCESS:
            return {
                ...state,
                fetchingUser: false,
                authInitialized: true,
                user: action.payload,
                error: null
            };


        case GET_ALL_CUSTOMER_SUCCESS:

            return {
                ...state,
                isLoading: false,
                customers: action.payload,
                error: null
            };


        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case GET_ALL_CUSTOMER_FAILURE:

            return {
                ...state,
                isLoading: false,
                error: action.payload
            };


        case GET_USER_FAILURE:
            return {
                ...state,
                fetchingUser: false,
                authInitialized: true,
                user: null,
                error: action.payload
            };


        case LOGOUT:

            localStorage.removeItem("jwt");

            return {
                ...initialState
            };


        default:
            return state;
    }
};


export default authReducer;