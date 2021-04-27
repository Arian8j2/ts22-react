import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


function Donate(): JSX.Element{
  const donators = useSelector((state: RootReducer) => state.donators);
  const [animIsLoaded, setAnimload] = useState(false);
  const extraClass = animIsLoaded ? "inner-hover": "animate__animated animate__zoomIn";

  useEffect(() => {
    setTimeout(() => {
      setAnimload(true);
    }, 1500);
  }, [setAnimload]);

  return (
    <div id="donate">
      <div id="donate-donate" className={`inner-box ${extraClass}`}>
        <div className="title">حمایت</div>
        <div className="title-info" style={{flexGrow: 1}}>برای حمایت از ما می تونید مبلغ دلخواهی رو به ما اهدا کنید که به ما در تمدید و ارتقا سرور کمک می کنه همچنین برای قدردانی ازت رنک مخصوصی دریافت می کنی</div>
        <div id="input-container">
          <input placeholder="مبلغ به تومان" type="number"/>
          <button style={{marginTop: ".25em"}}>ثبت</button>
        </div>
      </div>
      <div id="donate-donators" className={`inner-box ${extraClass} animate__delay-1s`}>
        <div className="title">حامیان مالی</div>
        <div id="donators">
          {donators.map((val) => 
            <div className="donator-layout">
              <div>{val.name}</div>
              <div>{val.amount}</div>
            </div>
          )}

        </div>
      </div>
      <div id="donate-price" className={`inner-box ${extraClass} animate__delay-2s`}>
        <div className="title">جوایز</div>
      </div>
    </div>
  )
}

export default Donate;