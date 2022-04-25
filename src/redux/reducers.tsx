import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Donator {
  name: string,
  amount: number
};

interface ClientInfo {
  cldbid: number,
  points: number,
  neededPoints: number,
  refid: string,
  ranks: number[],
  netUsage: number,
  connTime: number,
  donators: Donator[]
};
type ClientInfoSlice = ClientInfo & { isLoggedIn: boolean };

interface RankupData {
  points: number,
  neededPoints: number,
  ranks: number[]
};

const clientInfo = createSlice({
  name: "client info",
  initialState: {
    isLoggedIn: false
  } as ClientInfoSlice,
  reducers: {
    login: (state, datas: PayloadAction<ClientInfo>) => {
      return {
        isLoggedIn: true,
        ...datas.payload
      };
    },
    rankup: (state, datas: PayloadAction<RankupData>) => {
      return {
        ...state,
        ...datas.payload
      };
    },
    setRanks: (state, newRanks: PayloadAction<number[]>) => {
      state.ranks = newRanks.payload;
    },
    setRefid: (state, refid: PayloadAction<string>) => {
      state.refid = refid.payload;
    }
  }
});

type AlertType = "success" | "danger" | "info";
interface Alert {
  text: string,
  type: AlertType,
  extraClass?: string
};

const alert = createSlice({
  name: "alert",
  initialState: [] as Alert[],
  reducers: {
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.push(action.payload);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      return state.filter(val => val.text !== action.payload);
    }
  }
});

interface RootReducer {
  alert: Alert[],
  clientInfo: ClientInfoSlice
};

export { alert, clientInfo, type Alert, type AlertType, type Donator, type RootReducer };