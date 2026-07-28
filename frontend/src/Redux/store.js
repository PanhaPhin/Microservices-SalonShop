import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { salonReducer } from "./Salon/reducer";
import bookingReducer from "./Booking/reducer";
import authReducer from "./Auth/reducer";
import reviewReducer from "./Review/reducer";
import categoryReducer from "./Category/reducer";
import notificationReducer from "./Notifications/reducer";
import serviceOfferingReducer from "./Salon Services/reducer";




const rootReducers = combineReducers({
    salon:salonReducer,
    booking: bookingReducer,
    auth: authReducer,
    review: reviewReducer,
    category:categoryReducer,
    notification: notificationReducer,
    service: serviceOfferingReducer

});

export const store= legacy_createStore(rootReducers,applyMiddleware(thunk))