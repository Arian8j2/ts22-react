import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setClientInfo, setLoginState } from './redux/reducers';

function Login(){
  /* not show anything for 700 ms and if doesnt get
     response from server yet, show loading */
  const [isLoaded, setLoadState] = useState(true);  
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("login effect");
    let loadTimeout = setTimeout(() => {
      setLoadState(true);
    }, 700);

    (async () => {
      const response = await fetch("http://192.168.1.5:5000/login_api");
      if(!response.ok){
        // TODO: show alert 'connection lost'
        return;
      }

      const data = await response.json();
      if(data["found"] !== true){
        console.log("not found");
        // TODO: show alert 'not found'
        return;
      }

      let ranks: Array<number> = [];

      for(let rank of (data["ranks"] as string).split(","))
        ranks.push(parseInt(rank));

      dispatch(setClientInfo({
        cldbid: data["cldbid"],
        connTime: data["conn-time"],
        neededPoints: data["needed-points"],
        netUsage: data["net-usage"],
        points: data["points"],
        ranks: ranks,
        refid: data["refid"]
      }));


      dispatch(setLoginState(true));
    })();

    return () => {
      clearTimeout(loadTimeout); // prevent memory leak
    }
  }, [dispatch]);

  if(isLoaded){
    return (
      <div id="login-box" className="box animate__animated animate__zoomIn">
        <div>
          در حال شناسایی شما
        </div>
        <div id="search-icon-container">
          <i className="fas fa-search animate__animated animate__pulse animate__infinite"></i>
        </div>
      </div>
    )
  } else {
    return (
      <>
      </>
    );
  }
}

export default Login;