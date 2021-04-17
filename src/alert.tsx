import { useState } from 'react';

function Alert(){
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    text: "",
    durationSecond: 0,
    type: "success"
  });

  if(alertInfo.durationSecond > 0){
    setTimeout(() => {
      setAlertInfo({
        text: "",
        durationSecond: 0,
        type: "success"
      });
    }, 1000*alertInfo.durationSecond);
  }
    
  return (
    <div className="alert">
      <div className={`alert-text alert-${alertInfo.type}`}>
        {alertInfo.text}
      </div>
    </div>
  )
}