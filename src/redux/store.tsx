import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { loginStateSlice, clientInfoSlice, alertsSlice } from './reducers';

const rootReducer = combineReducers({
  isLogin: loginStateSlice.reducer,
  clientInfo: clientInfoSlice.reducer,
  alerts: alertsSlice.reducer
});

const store = configureStore({reducer: rootReducer});

export default store;