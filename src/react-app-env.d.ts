declare module '*.svg' {
  const content: string;
  export default content;
}

interface AlertNeededInfo{
  text: string,
  durationSecond: number,
  type: "success" | "danger" | "info"
};

interface AlertInfo{
  text: string,
  expireTime: number,
  type: "success" | "danger" | "info",
};

interface ClientInfo{
  cldbid: number,
  connTime: number,
  neededPoints: number,
  netUsage: number,
  points: number,
  ranks: number[],
  refid: string
};

interface RootReducer{
  isLogin: boolean,
  clientInfo: ClientInfo,
  alerts: AlertInfo[]
};