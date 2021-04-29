// TODO: rewrite whole alert system in better way

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAlerts } from './redux/reducers';
import { Flipper, Flipped } from 'react-flip-toolkit';

function Alert(){
  const [junkState, setJunkState] = useState(false); // just for re render every 500 ms
  const alerts = useSelector((state: RootReducer) => state.alerts);
  const dispatch = useDispatch();

  if(alerts.length === 0)
    return (<></>);

  setTimeout(() => {
    setJunkState(!junkState);
  }, 500);

  /* react-flip-toolkit doesnt remove transform 0 0 so animatecss calculates
     wrong space and scale out to diffrent location */
  setTimeout(() => {
    for(let alertText of document.getElementsByClassName("alert-text")){
      if(alertText.getAttribute("style") === "transform-origin: 0px 0px;"){
        alertText.removeAttribute("style");
      }
    }
  }, 600);

  setTimeout(() => {
    dispatch(updateAlerts());
  }, 2000);

  const nowTime = (new Date()).getTime();

  return (
    <Flipper flipKey={alerts} className="alert" spring="gentle">
        {alerts.map((val, index) => {
          let expireTime = val.durationSecond;
          return (
            <Flipped key={expireTime} flipId={expireTime}>
              <div key={expireTime} className={`alert-text alert-${val.type} animate__animated animate__zoom${expireTime - 500 < nowTime ? "Out": "In"}`}>
                <div className={`${val.extraClass? val.extraClass: ""}`}>
                  {val.text}
                </div>
              </div>
            </Flipped>
          );
        })}
    </Flipper>
  )
}

export default Alert;