declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
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

interface DonatorInfo{
  name: string,
  amount: number
};

interface RootReducer{
  isLogin: boolean,
  clientInfo: ClientInfo,
  alerts: AlertInfo[],
  donators: DonatorInfo[]
};