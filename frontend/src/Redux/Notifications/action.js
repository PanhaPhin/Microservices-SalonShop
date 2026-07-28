


import api from "../../config/api";
import {  FETCH_NOTIFICATIONS_BY_USER_SUCCESS, FETCH_NOTIFICATIONS_BY_USER_REQUEST, FETCH_NOTIFICATIONS_REQUEST, FETCH_NOTIFICATIONS_BY_USER_FAILURE,FETCH_NOTIFICATIONS_BY_SALON_REQUEST,FETCH_NOTIFICATIONS_BY_SALON_SUCCESS ,FETCH_NOTIFICATIONS_BY_SALON_FAILURE , MARK_NOTIFICATION_AS_READ_REQUEST,MARK_NOTIFICATION_AS_READ_SUCCESS, MARK_NOTIFICATION_AS_READ_FAILURE, DELETE_NOTIFICATION_REQUEST, DELETE_NOTIFICATION_SUCCESS, DELETE_NOTIFICATION_FAILURE, ADD_NOTIFICATION} from "./actionTypes";

const API_URL = "api/notifications";

export const fetchNotifications = (jwt) => async (dispatch) => {
    dispatch ({ type: FETCH_NOTIFICATIONS_REQUEST});
    try{
        const response = await api.get(`${API_URL}`);
        dispatch({ type: FETCH_NOTIFICATIONS_REQUEST, payload: response.data });
    } catch (error) {
        dispatch ({type: FETCH_NOTIFICATIONS_REQUEST, payload: error.message});

    }

};

export const fetchNotificationsByUser = ({userId,jwt}) => async (dispatch) =>{
    dispatch({ type: FETCH_NOTIFICATIONS_BY_USER_REQUEST});
    try{
        const response = await api.get(`${API_URL}/user/${userId}` ,
            {
                headers: { Authorization: `Bearer ${jwt}`},

            }
        );
        console.log("fetch notifications", response.data)
        dispatch({ type: FETCH_NOTIFICATIONS_BY_USER_SUCCESS, payload: response.data });
    } catch (error) {
        console.error("Error fetching notifications by user", error);
        dispatch({ type: FETCH_NOTIFICATIONS_BY_USER_FAILURE, payload: error.message });
    }
};

export const fetchNotificationsBySalon = ({salonId, jwt}) => async (dispatch) =>{
    dispatch({ type: FETCH_NOTIFICATIONS_BY_SALON_REQUEST});
    try{
        const response = await api.get(`${API_URL}/salon-owner/${salonId}` ,
            {
                headers: { Authorization: `Bearer ${jwt}`},
            }
        );
        console.log("fetch salon notifications", response.data)
        dispatch({ type: FETCH_NOTIFICATIONS_BY_SALON_SUCCESS, payload: response.data });

    } catch (error){
        dispatch({ type: FETCH_NOTIFICATIONS_BY_SALON_FAILURE, payload: error.message });
    }
    

}

export const markNotificationAsRead = (notificationId, jwt) => async (dispatch) => {
    dispatch({ type: MARK_NOTIFICATION_AS_READ_REQUEST });
    try{
        const response = await api.put(`${API_URL}/${notificationId}/read`,{},{
            headers: { Authorization: `Bearer ${jwt}`},
        });
        console.log("Notification marked as read:", response.data);
        dispatch({ type: MARK_NOTIFICATION_AS_READ_SUCCESS, payload: response.data });
    } catch (error){
        console.log("mark notification as read error -" ,error)
        dispatch({type: MARK_NOTIFICATION_AS_READ_FAILURE, payload: error.message});
    }
};


export const addNotification = (notification) => {
    return {
        type: ADD_NOTIFICATION,
        payload: notification,
    }
}


// export const deleteNotification = (notificationId) => async (dispatch) =>{
//     dispatch ({ type: DELETE_NOTIFICATION_REQUEST});
//     try{
//         await api.delete(`${API_URL}/${notificationId}`);
//         dispatch({type: DELETE_NOTIFICATION_SUCCESS, payload: notificationId});


//     } catch (error){
//         dispatch({ type: DELETE_NOTIFICATION_FAILURE , payload: error.message});
//     }

// };


// export const addNotification = (notification) =>{
//     return {
//         type: ADD_NOTIFICATION,
//         payload: notification,

//     }
// }