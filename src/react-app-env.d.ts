interface AppState{
    isLogin: boolean
};
type AppStateSetter = (newState: AppState) => void;
