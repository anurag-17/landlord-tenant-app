import { LOGIN, LOGOUT } from "./action";

// Define initial state and reducer
const initialState = {
    isLoggedIn: false,
    token: null
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN:
        return {
          ...state,
          isLoggedIn: true,
          token: action.payload
        };
      case LOGOUT:
        return {
          ...state,
          isLoggedIn: false,
          token: null
        };
      default:
        return state;
    }
  };
  