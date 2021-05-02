import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAlert, setClientInfo, setLoginState, setDonators } from './redux/reducers';
import { API_URL } from './constants';

function Login(){
  /* not show anything for 700 ms and if doesnt get
     response from server yet, show loading */
  const [isLoaded, setLoadState] = useState(true);  
  const dispatch = useDispatch();

  useEffect(() => {
    let loadTimeout = setTimeout(() => {
      setLoadState(true);
    }, 700);

    (async () => {
      const response = await fetch(`http://${API_URL}/login_api`);
      if(!response.ok){
        dispatch(addAlert({
          text: "مشکل در برقراری ارتباط با سرور",
          durationSecond: 5,
          type: "danger"
        }));
        return;
      }

      const data = await response.json();
      if(data["found"] !== true){
        if(data["quest"]){
          dispatch(addAlert({
            text: "برای استفاده از قابلیت های سایت باید حداقل رنک Member داشته باشید",
            durationSecond: 10,
            type: "danger"
          }));
        } else {
          dispatch(addAlert({
            text: "متاسفانه نتونستیم شما را شناسایی کنیم، به احتمال زیاد مشکل شما استفاده از فیلترشکن جدا در مرورگر هست یا اینترنت شما با کسی که در تیم اسپیک هست فرق دارد و یا کلا در تیم اسپیک نیستید.",
            durationSecond: 20,
            type: "danger"
          }));
        }

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

      // TODO: donators is not implemented in backend !
      
      let donators: DonatorInfo[] = []
      const maxNameLength = 15;

      for(let donator of (data["donators"] as Record<string, number>[])){
        let name: string = Object.keys(donator)[0];
        donators.push({
          name: name.length > maxNameLength ? name.substring(0, maxNameLength - 3) + "..." : name,
          amount: donator[name]
        });
      }

      dispatch(setDonators(donators));
      dispatch(setLoginState(true));
    })();

    return () => {
      clearTimeout(loadTimeout); // prevent memory leak
    }
  }, [dispatch]);

  let loadingCircles = []
  for(let i=0; i < 30; i++)
    loadingCircles.push(<div key={i} className="loading-circle"></div>);

  if(isLoaded){
    return (
      <div id="login-box" className="box animate__animated animate__zoomIn">
        <div>
          در حال شناسایی شما
        </div>
        <div id="loading">
          {loadingCircles}
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