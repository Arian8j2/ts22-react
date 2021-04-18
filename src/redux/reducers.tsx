import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const loginStateSlice = createSlice({
  name: "login",
  initialState: {
    value: false
  } as LoginState,
  reducers: {
    setLoginState: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    }
  }
});

const clientInfoSlice = createSlice({
  name: "client info",
  initialState: {

  } as ClientInfo,
  reducers: {
    setClientInfo: (state, action: PayloadAction<ClientInfo>) => {
      state.cldbid = action.payload.cldbid;
      state.connTime = action.payload.connTime;
      state.neededPoints = action.payload.neededPoints;
      state.netUsage = action.payload.netUsage;
      state.points = action.payload.points;
      state.ranks = action.payload.ranks;
      state.refid = action.payload.refid;
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