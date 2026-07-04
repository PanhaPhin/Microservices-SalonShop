import { act } from "react";
import { FETCH_CUSTOMER_BOOKINGS_REQUEST, FETCH_SALON_BOOKINGS_REQUEST, GET_ALL_SALON_SUCCESS, UPDATE_BOOKING_STATUS_SUCCESS ,FETCH_SALON_BOOKINGS_FAILURE, UPDATE_BOOKING_STATUS_FAILURE } from "./actionTypes";


const initialState ={
    booking: [],
    slot: [],
    booking: null,
    isLoading: false,
    error: null,
    report: null,
};


const bookingReducer = (state = initialState ,action) => {
    switch (action.type){
        case CREATE_BOOKING_REQUEST:
        case FETCH_CUSTOMER_BOOKINGS_REQUEST:
        case FETCH_SALON_BOOKINGS_REQUEST:
        case FETCH_BOOKING_BY_ID_REQUEST:
        case UPDATE_BOOKING_STATUS_SUCCESS:
            return { ...state, isLoading: true, error: null };
        case CREATE_BOOKING_SUCCESS:
            return { ...state, isLoading: false, booking: action.payload };
        
        case FETCH_CUSTOMER_BOOKINGS_REQUEST:
        case FETCH_SALON_BOOKINGS_REQUEST:
            return { ...state, isLoading: false, booking: action.payload };

        case FETCH_BOOKING_BY_ID_SUCCESS:
            return { ...state, isLoading: false, booking: action.payload };
        

        case UPDATE_BOOKING_STATUS_SUCCESS:
            return { ...state, isLoading: false, booking: state.booking.map((item) =>
                item.id === action.payload.id ? action.payload : item
             ),
            };

        case GET_ALL_SALON_SUCCESS:
            return {
                ...state,
                isLoading: false,
                report: action.payload,
            };
        case FETCH_BOOKED_SLOTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                slot: action.payload,
                error: null,
            };

        case CREATE_BOOKING_FAILURE:
        case FETCH_SALON_BOOKINGS_FAILURE:
        case FETCH_SALON_BOOKINGS_FAILURE:
        case FETCH_BOOKING_BY_ID_FAILURE:
        case UPDATE_BOOKING_STATUS_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
            
        default:
            return state;

            


        
        
    }

}

