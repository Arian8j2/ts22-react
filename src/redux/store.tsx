import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { clientInfo, alert } from './reducers';

const rootReducer = combineReducers({
  clientInfo: clientInfo.reducer,
  alert: alert.reducer,
});

const store = configureStore({ reducer: rootReducer });
export default store;