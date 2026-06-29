import { API_BASE_URL } from "../../config/api";
import { LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./actionTypes"


export const registerUser =(userData) => async (dispatch) =>{
    dispatch ({ type: REGISTER_REQUEST});
    console.log("auth action - ", userData)

    try{
        const response = await axios.post(
            `${API_BASE_URL}/auth/signup`,
            userData.userData
        );
        const user = response.data;
        if (user?.jwt){
            localStorage.setItem("jwt", user.jwt);
            userData.navigate("/");
        }
        console.log("register :- ", user);
        dispatch({ type: REGISTER_SUCCESS, payload: user});
    } catch (error){
        console.log("error", error);
        dispatch({type: REGISTER_FAILURE, payload: error})
    }
}

const loginRequest = () => ({ type: LOGIN_REQUEST});
const loginSuccess = (user) => ({type: LOGIN_SUCCESS, payload: user})

export const loginUser = (userData) => async (dispatch) =>{
    dispatch({type:LOGIN_REQUEST});
    try{
        const response = await axios.post(
            `${API_BASE_URL}/auth/login`,
            userData.data
        );
        const user = response.data;
        if(user.data?.jwt){
            localStorage.setItem("jwt",user.data.jwt);
            if(user.data?.role=== "ROLE_ADMIN"){
                userData.navigate("/admin");
            } else if (user.data?.role === "ROLE_SALON_OWNER"){
                userData.navigate("/salon-dashboard");
            }
            else{
                userData.navigate("/")

            }

        }
        console.log("login ", user)
    }
}