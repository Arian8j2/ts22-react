interface AppState{
  isLogin: boolean,
  buffer: ContentState
};
type AppStateSetter = (newState: AppState) => void;

interface ContentState{
  cldbid: number,
  connTime: number,
  neededPoints: number,
  netUsage: number,
  points: number,
  ranks: Array[number],
  refid: string
};

declare module '*.svg' {
  const content: string;
  export default content;
}
