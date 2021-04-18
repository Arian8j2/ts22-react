// TODO: rewrite whole alert system in better way

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAlerts } from './redux/reducers';

function Alert(){
  const [junkState, setJunkState] = useState(false); // just for re render every 500 ms
  const alerts = useSelector((state: RootReducer) => state.alerts);
  const dispatch = useDispatch();

  if(alerts.length === 0)
    return (<></>);

  setTimeout(() => {
    setJunkState(!junkState);
  }, 500);

  setTimeout(() => {
    dispatch(updateAlerts());
  }, 2000);

  const nowTime = (new Date()).getTime();

  return (
    <div className="alert">
      {alerts.map((val, index) => {
        return (
          <div key={val.expireTime} className={`alert-text alert-${val.type} animate__animated animate__zoom${val.expireTime - 1000 < nowTime? "Out": "In"}`}>
            {val.text}
          </div>
        );
      })}
    </div>
  )
}

export default Alert;