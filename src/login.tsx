import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clientInfo, type AlertType, type Donator } from './redux/reducers';
import { fetchWrapper, addAlert } from './utils';

export default function Login() {
  /*   
    not show anything for small time and if doesnt get
    response from server yet, show loading
  */
  const [isLoaded, setLoadState] = useState(false);  
  const dispatch = useDispatch();

  useEffect(() => {
    let loadTimeout = setTimeout(() => {
      setLoadState(true);
    }, 700);

    (async () => {
      try {
        var response = await fetchWrapper("login");
      } catch (err: any) {
        addAlert({ text: err, type: "danger" }, 15);
        return;
      }

      const data: any = await response.json();
      const serverAlertTypes: AlertType[] = [ "success", "danger", "info" ];
      
      if (data["alert"]) {
        addAlert({
          text: data["alert"]["text"],
          type: serverAlertTypes[data["alert"]["type"]]
        }, 30);
      }

      if (data["quest"]) {
        addAlert({
          text: "برای استفاده از قابلیت های سایت باید حداقل رنک Member داشته باشید",
          type: "danger"
        }, 10);
        return;
      }

      if (!data["found"]) {
        addAlert({
          text: "متاسفانه نتونستیم شما را شناسایی کنیم، به احتمال زیاد مشکل شما استفاده از فیلترشکن جدا در مرورگر هست یا اینترنت شما با کسی که در تیم اسپیک هست فرق دارد و یا کلا در تیم اسپیک نیستید.",
          type: "danger"
        }, 20);
        return;
      }

      const MAX_NAME_LENGTH = 15;
      let donators: Donator[] = [];

      for (let donator of data["donators"] as Donator[]) {
        /*
          some utf characters counted twice 
          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length#unicode
        */
        let nameArray: string[] = [...donator.name]; 

        donators.push({
          name: nameArray.length > MAX_NAME_LENGTH ? 
            nameArray.slice(0, MAX_NAME_LENGTH - 3).join("") + "..." : donator.name,
          amount: donator.amount
        });
      }

      dispatch(clientInfo.actions.login({
        cldbid: data["cldbid"],
        connTime: data["conn-time"],
        neededPoints: data["needed-points"],
        netUsage: data["net-usage"],
        points: data["points"],
        ranks: data["ranks"],
        refid: data["refid"],
        donators
      }));

      const root = document.getElementById("root");
      if (root != null)
        root.style.backgroundPosition = "center";
    })();

    return () => clearTimeout(loadTimeout);
  }, []);

  let loadingCircles = []
  for (let i=0; i < 30; i++)
    loadingCircles.push(<div key={i} className="loading-circle"></div>);

  if (!isLoaded) {
    return (null);
  }

  return (
    <div id="login-box" className="box animate__animated animate__zoomIn">
      <div>
        در حال شناسایی شما
      </div>
      <div id="loading">
        {loadingCircles}
      </div>
    </div>
  );
}