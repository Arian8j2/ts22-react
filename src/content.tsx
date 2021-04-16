import React from 'react';
import Sidebar from './sidebar';

import Dashboard from './contents/dashboard';
import Rank from './contents/rank';
import Donate from './contents/donate';

import { BrowserRouter, Switch, Route, Redirect }  from 'react-router-dom';


type ContentProp = {clientInfo: ContentState};

class Content extends React.Component<ContentProp, ContentState, (newState: ContentState) => void>{
  constructor(props: ContentProp){
    super(props); 
    this.state = props.clientInfo;
  }

  render(){
    return (
      <div id="content" className="box animate__animated animate__zoomIn">
        <BrowserRouter>
          <Sidebar />

          <div id="content-content">
            <Switch>
              <Route path="/rank" exact component={Rank} />
              <Route path="/donate" exact component={Donate} />
              <Route path="/dashboard" exact render={(props) => (
                <Dashboard {...props} data={this.state} />
              )} />

              <Route path="/">
                <Redirect to="/dashboard" />
              </Route>
            </Switch>
          </div>
          
          
        </BrowserRouter>
      </div>
    );
  }
};

export default Content;