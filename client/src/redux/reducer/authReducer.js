import { LOGIN, LOGOUT, USER_DETAILS } from "../action/authAction";

// Define initial state and reducer
const initialState = {
    isLoggedIn: false,
    token: null,
    userDetails: null
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN:
        // console.log(action.payload)
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
          case USER_DETAILS:
            // console.log(action.payload)
            return {
              ...state,
              userDetails : action.payload
            };
      default:
        return state;
    }
  };
  