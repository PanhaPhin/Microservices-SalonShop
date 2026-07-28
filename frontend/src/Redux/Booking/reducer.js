import {
    CREATE_BOOKING_REQUEST,
    CREATE_BOOKING_SUCCESS,
    CREATE_BOOKING_FAILURE,

    FETCH_CUSTOMER_BOOKINGS_REQUEST,
    FETCH_CUSTOMER_BOOKINGS_SUCCESS,
    FETCH_CUSTOMER_BOOKINGS_FAILURE,

    FETCH_SALON_BOOKINGS_REQUEST,
    FETCH_SALON_BOOKINGS_SUCCESS,
    FETCH_SALON_BOOKINGS_FAILURE,

    UPDATE_BOOKING_STATUS_REQUEST,
    UPDATE_BOOKING_STATUS_SUCCESS,
    UPDATE_BOOKING_STATUS_FAILURE,

    GET_ALL_SALON_REQUEST,
    GET_ALL_SALON_SUCCESS,
    GET_ALL_SALON_FAILURE,

    FETCH_BOOKED_SERVICES_REQUEST,
    FETCH_BOOKED_SERVICES_SUCCESS,
    FETCH_BOOKED_SERVICES_FAILURE

} from "./actionTypes";


const initialState = {
    bookings: [],
    booking: null,
    services: [],
    report: null,
    isLoading: false,
    error: null,
};


const bookingReducer = (state = initialState, action) => {

    switch (action.type) {

        // Loading
        case CREATE_BOOKING_REQUEST:
        case FETCH_CUSTOMER_BOOKINGS_REQUEST:
        case FETCH_SALON_BOOKINGS_REQUEST:
        case UPDATE_BOOKING_STATUS_REQUEST:
        case GET_ALL_SALON_REQUEST:
        case FETCH_BOOKED_SERVICES_REQUEST:

            return {
                ...state,
                isLoading: true,
                error: null
            };


        // Create Booking
        case CREATE_BOOKING_SUCCESS:

            return {
                ...state,
                isLoading: false,
                booking: action.payload
            };


        case CREATE_BOOKING_FAILURE:

            return {
                ...state,
                isLoading: false,
                error: action.payload
            };


        // Customer Booking
        case FETCH_CUSTOMER_BOOKINGS_SUCCESS:

            return {
                ...state,
                isLoading: false,
                bookings: action.payload
            };


        case FETCH_CUSTOMER_BOOKINGS_FAILURE:

            return {
                ...state,
                isLoading: false,
                error: action.payload
            };


        // Salon Booking
        case FETCH_SALON_BOOKINGS_SUCCESS:

            return {
                ...state,
                isLoading: false,
                bookings: action.payload
            };


        case FETCH_SALON_BOOKINGS_FAILURE:

            return {
                ...state,
                isLoading: false,
                error: action.payload
            };


        // Update Booking Status
        case UPDATE_BOOKING_STATUS_SUCCESS:

            return {
                ...state,
                isLoading: false,

                bookings: state.bookings.map((item) =>
                    item.id === action.payload.id
                        ? action.payload
                        : item
                )
            };


        case UPDATE_BOOKING_STATUS_FAILURE:

            return {
                ...state,
                isLoading: false,
                error: action.payload
            };


        // Salon Report
        case GET_ALL_SALON_SUCCESS:

            return {
                ...state,
                isLoading: false,
                report: action.payload
            };


        case GET_ALL_SALON_FAILURE:

            return {
                ...state,
                isLoading: false,
                error: action.payload
            };


        // Booked Services
        case FETCH_BOOKED_SERVICES_SUCCESS:

            return {
                ...state,
                isLoading: false,
                services: action.payload
            };


        case FETCH_BOOKED_SERVICES_FAILURE:

            return {
                ...state,
                isLoading: false,
                error: action.payload
            };


        default:
            return state;
    }
};


export default bookingReducer;