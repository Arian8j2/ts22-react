import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const loginStateSlice = createSlice({
  name: "login",
  initialState: false,
  reducers: {
    setLoginState: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    }
  }
});

const clientInfoSlice = createSlice({
  name: "client info",
  initialState: {} as ClientInfo,
  reducers: {
    setClientInfo: (state, action: PayloadAction<ClientInfo>) => {
      return action.payload;
      /* dont use state = 'action.payload'
      https://redux-toolkit.js.org/usage/immer-reducers#resetting-and-replacing-state */
    },

    setClientRefid: (state, action: PayloadAction<string>) => {
      state.refid = action.payload;
    }
  }
});

const alertsSlice = createSlice({
  name: "alerts",
  initialState: [] as AlertInfo[],
  reducers: {
    addAlert: (state, action: PayloadAction<AlertInfo>) => {
      state.push(action.payload);
    }
  }
});

export {loginStateSlice, clientInfoSlice, alertsSlice};

export const addAlert = alertsSlice.actions.addAlert,
             setLoginState = loginStateSlice.actions.setLoginState,
             setClientInfo = clientInfoSlice.actions.setClientInfo,
             setClientRefid = clientInfoSlice.actions.setClientRefid;