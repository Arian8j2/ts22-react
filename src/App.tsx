import React from 'react';

import Login from './login';
import Content from './content';

import 'animate.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

class App extends React.Component<any, AppState, AppStateSetter>{
  constructor(props: any){
    super(props);
    this.state = {
      isLogin: false
    };
  }

  render(){
    if(this.state.isLogin)
      return <Content />
    else
      return <Login appStateSetter={this.setState.bind(this)}/>
  }
};

export default App;