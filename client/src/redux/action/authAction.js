// Define action types
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const USER_DETAILS = "USER_DETAILS";


export const setToken = (token) => {
    // console.log("Token received:", token); 
    return { type: LOGIN, payload: token };
  };

export const removeToken = () => ({ type: LOGOUT });

export const setUserDetails = (payload) => {
    // console.log("Token received:", token); 
    return { type: USER_DETAILS, payload: payload };
  };