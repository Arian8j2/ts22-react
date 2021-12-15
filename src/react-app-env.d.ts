declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

type AlertType = "success" | "danger" | "info";
interface AlertInfo{
  text: string,
  type: AlertType,
  extraClass?: string
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