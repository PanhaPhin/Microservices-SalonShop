import { API_BASE_URL } from "../../config/api";
import { CREATE_BOOKING_FAILURE, UPDATE_BOOKING_STATUS_REQUEST } from "./actionTypes";


export const createBooking =
  ({ jwt, salonId, bookingData }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_BOOKING_REQUEST });

    try {
      const { data } = await axios.post(
        API_BASE_URL,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            salonId,
            paymentMethod: "BAKONG",
          },
        }
      );

      console.log("Create Booking Response:", data);

      dispatch({
        type: CREATE_BOOKING_SUCCESS,
        payload: data,
      });


      if (data?.payment_scan_qr) {
        window.location.href = data.payment_scan_qr;
      } else {
        console.error("Bakong QR URL not found in response.");
      }
    } catch (error) {
      console.error(
        "Error creating booking:",
        error.response?.data || error.message
      );

      dispatch({
        type: CREATE_BOOKING_FAILURE,
        payload:
          error.response?.data?.message || error.message,
      });
    }
  };

  export const fetchBookingById =(bookingId) => async (dispatch) =>{
    dispatch({type: FETCH_BOOKING_BY_ID_REQUEST});
    try{
        const {data} = await api.get(`${API_BASE_URL}/${bookingId}`);
        dispatch({type: FETCH_BOOKING_BY_ID_SUCCESS, payload: data});
    } catch (error){
        dispatch({type: FETCH_BOOKING_BY_FAILURE , payload: error.message});
    }

  };

  export const fetchSalonBookings = ({jwt}) => async (dispatch) =>{
    dispatch({type: FETCH_SALON_BOOKINGS_REQUEST});
    try{
        const {data} = await api.get(`${API_BASE_URL}/salon` ,{
            headers: { Authorization: `Bearer ${jwt}`},
            
        });
        console.log("Salon Bookings:", data);
        dispatch({type: FETCH_SALON_BOOKINGS_SUCCESS, payload: data});
    } catch (error){
        console.log("error fetching salon bookings", error);
        dispatch({type: FETCH_SALON_BOOKINGS_FAILURE, payload: error.message});

    }
  };

  export const updateBookingStatus = ({bookingId, status, jwt}) => async (dispatch) =>{
    dispatch ({type: UPDATE_BOOKING_STATUS_REQUEST});
    
    try{
        const {data} = await api.put(`${API_BASE_URL}/${bookingId}/status`,null,{
            headers: { Authorization: `Bearer ${jwt}`},
            params: {status},
        });
        console.log("Update Booking Status:", data);
        dispatch({type: UPDATE_BOOKING_STATUS_SUCCESS, payload: data});
    } catch (error){
        console.log("error updating booking status", error);
        dispatch({type: UPDATE_BOOKING_STATUS_FAILURE, payload: error.message});
    }

  };

  export const getSalonReport = (jwt) => async (dispatch) =>{
    try {
        dispatch ({ type: GET_SALON_REPORT_REQUEST });

        const response = await api.get(`/api/bookings/report`,{
            headers:{
                'Authorization': `Bearer ${jwt}`,

            }

        });

        dispatch({
            type: GET_SALON_REPORT_SUCCESS,
            payload: response.data,

        });
        console.log("booking Report:", response.data);


    }  catch (error){
        console.log("error ", error)

        dispatch({
            type: GET_SALON_REPORT_FAILURE,
            payload: error.response ? error.response.data : error.message,

        });


    }

  };



export const fetchBookedSlotsRequest = () => ({
    type: FETCH_BOOKED_SLOTS_REQUEST,
});

export const fetchBookedSlotsSuccess = (slots) =>({
    type: FETCH_BOOKED_SLOTS_SUCCESS,
    payload: slots,

})