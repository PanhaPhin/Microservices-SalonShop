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
    error: null,
    jwt: null,
};


const authReducer = (state = initialState, action) => {

    switch (action.type) {

        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case GET_ALL_CUSTOMER_REQUEST:

            return {
                ...state,
                isLoading: true,
                error: null
            };


        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:

            return {
                ...state,
                isLoading: false,
                jwt: action.payload?.jwt
            };


        case GET_USER_SUCCESS:

            return {
                ...state,
                isLoading: false,
                user: action.payload,
                fetchingUser: false
            };


        case GET_ALL_CUSTOMER_SUCCESS:

            return {
                ...state,
                isLoading: false,
                customers: action.payload
            };


        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
        case GET_ALL_CUSTOMER_FAILURE:

            return {
                ...state,
                isLoading: false,
                error: action.payload
            };


        case LOGOUT:

            localStorage.removeItem("jwt");

            return {
                ...state,
                jwt: null,
                user: null
            };


        default:
            return state;
    }
};


export default authReducer;