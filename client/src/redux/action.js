// Define action types
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

// Define action creators
export const login = (token) => ({ type: LOGIN, payload: token });
export const logout = () => ({ type: LOGOUT });
