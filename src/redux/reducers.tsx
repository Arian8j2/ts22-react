import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InfosAfterRankUp{
  neededPoints: number,
  points: number,
  ranks: number[]
};

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
      /* dont use 'state = action.payload'
      https://redux-toolkit.js.org/usage/immer-reducers#resetting-and-replacing-state */
    },

    setClientRefid: (state, action: PayloadAction<string>) => {
      state.refid = action.payload;
    },

    setClientInfoAfterRankUp: (state, action: PayloadAction<InfosAfterRankUp>) => {
      state.points = action.payload.points;
      state.neededPoints = action.payload.neededPoints;
      state.ranks = action.payload.ranks;
    },

    setClientRanks: (state, action: PayloadAction<number[]>) => {
      state.ranks = action.payload;
    }
  }
});

const alertsSlice = createSlice({
  name: "alerts",
  initialState: [] as AlertInfo[],
  reducers: {
    addAlert: (state, action: PayloadAction<AlertInfo>) => {
      state.push(action.payload);    
    },

    removeAlert: (state, action: PayloadAction<string>) => {
      return state.filter(val => val.text !== action.payload);
    }
  }
});

const donatorsSlice = createSlice({
  name: "donators",
  initialState: [] as DonatorInfo[],
  reducers: {
    setDonators: (state, action: PayloadAction<DonatorInfo[]>) => {
      return action.payload;
    }
  }
})

export {loginStateSlice, clientInfoSlice, alertsSlice, donatorsSlice};

export const addAlert = alertsSlice.actions.addAlert,
             removeAlert = alertsSlice.actions.removeAlert,
             setLoginState = loginStateSlice.actions.setLoginState,
             setClientInfo = clientInfoSlice.actions.setClientInfo,
             setClientRefid = clientInfoSlice.actions.setClientRefid,
             setClientInfoAfterRankUp = clientInfoSlice.actions.setClientInfoAfterRankUp,
             setClientRanks = clientInfoSlice.actions.setClientRanks,
             setDonators = donatorsSlice.actions.setDonators;