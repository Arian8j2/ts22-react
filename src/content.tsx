import { useState } from 'react';
import Sidebar from './sidebar';

import Dashboard from './contents/dashboard';
import Rank from './contents/rank';
import Donate from './contents/donate';

import { BrowserRouter, Switch, Route, Redirect }  from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';


type ContentProp = {clientInfo: ContentState};

function Content(props: ContentProp){
  const [clientInfo, setClientInfo] = useState(props.clientInfo);
  const isMobile = useMediaQuery({query: "(max-width: 600px)"});

  return (
    <BrowserRouter>
      <div id="content" className="box animate__animated animate__zoomIn">
        {!isMobile && <Sidebar isMobile={isMobile} />}

        <div id="content-content">
          <Switch>
            <Route path="/rank" exact component={Rank} />
            <Route path="/donate" exact component={Donate} />
            <Route path="/dashboard" exact render={(props) => (
              <Dashboard data={clientInfo} />
            )} />

            <Route path="/">
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        </div>  
      </div>

      {isMobile && <Sidebar isMobile={isMobile} />}
    </BrowserRouter>
  );
}

export default Content;