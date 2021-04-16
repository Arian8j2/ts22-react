import React from 'react';

interface LoginProp{
  appStateSetter: AppStateSetter
};

interface LoginState{
  setAppState: AppStateSetter,
  loadState: LoginLoadState
};

type LoginLoadState = "wait" | "loaded" | "remove-animation";
type LoginStateSetter = (newState: LoginState) => void;

class Login extends React.Component<LoginProp, LoginState, LoginStateSetter>{
  constructor(props: LoginProp){
    super(props);
    this.state = {
      setAppState: props.appStateSetter,
      loadState: "wait"
    };
  }

  componentDidMount(){
    fetch("http://127.0.0.1:5000/login_api").then(res => res.json())
    .then(
      (res) => {
        if(res["found"] !== true){
          // TODO: show alert
          return;
        }

        let ranks: Array<number> = [];

        for(let rank of (res["ranks"] as string).split(","))
          ranks.push(parseInt(rank));
        
        this.state.setAppState({
          isLogin: true,
          buffer: {
            cldbid: res["cldbid"],
            connTime: res["conn-time"],
            neededPoints: res["needed-points"],
            netUsage: res["net-usage"],
            points: res["points"],
            ranks: ranks,
            refid: res["refid"]
          }
        })
      },

      // on error
      (error) => {
        // TODO: add alert showing
      }
    );

    setTimeout(() => {
      this.setState({
        setAppState: this.state.setAppState,
        loadState: "loaded"
      });
    }, 700);
  }

  render(){
    if(this.state.loadState === "wait")
      return (<></>);
    else
      return (
        <div id="login-box" className={"box " + (this.state.loadState === "loaded" ? "animate__animated animate__zoomIn": "")}>
          <div>
            در حال شناسایی شما
          </div>
          <div id="search-icon-container">
            <i className="fas fa-search animate__animated animate__pulse animate__infinite"></i>
          </div>
        </div>
      );
  }
};

export default Login;