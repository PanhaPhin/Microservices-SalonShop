import {
  FETCH_NOTIFICATIONS_BY_SALON_REQUEST,
  FETCH_NOTIFICATIONS_BY_USER_REQUEST,
  FETCH_NOTIFICATIONS_REQUEST,
  MARK_NOTIFICATION_AS_READ_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  ADD_NOTIFICATION,
  MARK_NOTIFICATION_AS_READ_SUCCESS,
  DELETE_NOTIFICATION_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  FETCH_NOTIFICATIONS_BY_USER_FAILURE,
  FETCH_NOTIFICATIONS_BY_SALON_FAILURE,
  MARK_NOTIFICATION_AS_READ_FAILURE,
} from "./actionTypes";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
    case FETCH_NOTIFICATIONS_BY_USER_REQUEST:
    case FETCH_NOTIFICATIONS_BY_SALON_REQUEST:
    // case CREATE_NOTIFICATIONS_REQUEST:
    case MARK_NOTIFICATION_AS_READ_REQUEST:
    // case DELETE_NOTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
      };

    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };

    // case CREATE_NOTIFICATION_SUCCESS:
    //     return{
    //         ...state,
    //         loading: false,
    //         notifications: [...state.notifications, action.payload],
    //     };

    case MARK_NOTIFICATION_AS_READ_SUCCESS: {
      const wasUnread = state.notifications.some(
        (notification) =>
          notification.id === action.payload.id && !notification.read
      );

      return {
        ...state,
        loading: false,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload.id ? action.payload : notification
        ),
        unreadCount: wasUnread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    }

    case DELETE_NOTIFICATION_SUCCESS: {
      const deletedNotification = state.notifications.find(
        (notification) => notification.id === action.payload
      );
      const wasUnread = deletedNotification && !deletedNotification.read;

      return {
        ...state,
        loading: false,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
        unreadCount: wasUnread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    }

    case FETCH_NOTIFICATIONS_FAILURE:
    case FETCH_NOTIFICATIONS_BY_USER_FAILURE:
    case FETCH_NOTIFICATIONS_BY_SALON_FAILURE:
    // case CREATE_NOTIFICATION_FAILURE:
    case MARK_NOTIFICATION_AS_READ_FAILURE:
    // case DELETE_NOTIFICATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default notificationReducer;