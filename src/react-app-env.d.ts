declare module '*.svg' {
  const content: string;
  export default content;
}

interface AlertInfo{
  text: string,
  durationSecond: number,
  type: "success" | "danger"
};

interface ClientInfo{
  cldbid: number,
  connTime: number,
  neededPoints: number,
  netUsage: number,
  points: number,
  ranks: Array[number],
  refid: string
};

interface RootReducer{
  isLogin: LoginState,
  clientInfo: ClientInfo,
  alerts: AlertInfo[]
};

interface LoginState{
  value: boolean
};