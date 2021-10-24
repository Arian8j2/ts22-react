import Sidebar from './sidebar';

import { BrowserRouter, Switch, Route, Redirect }  from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { navInfo } from './sidebar';

function Content(){
  const isMobile = useMediaQuery({query: "(max-width: 600px)"});
  let defaultRoute: string = "";

  for(let info of navInfo){
    if(info.isDefault){
      defaultRoute = info.url;
      break;
    }
  }

  return (
    <BrowserRouter>
      <div id="content" className="box animate__animated animate__zoomIn">
        {!isMobile && <Sidebar isMobile={isMobile} />}

        <div id="content-content">
          <Switch>
            {navInfo.map(info => 
              <Route key={info.url} path={info.url} exact component={info.component} />
            )}

            <Route path="/">
              <Redirect to={defaultRoute} />
            </Route>
          </Switch>
        </div>  
      </div>

      {isMobile && <Sidebar isMobile={isMobile} />}
    </BrowserRouter>
  );
}

export default Content;