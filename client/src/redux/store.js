// store.js
import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { authReducer } from './reducer';



// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer
});

// Create the Redux store
const store = createStore(rootReducer);

export default store;
