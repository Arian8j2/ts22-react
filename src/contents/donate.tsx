import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {ReactComponent as HeartPic} from '../images/heart.svg';

function Donate(): JSX.Element{
  const donators = useSelector((state: RootReducer) => state.donators);
  const [animIsLoaded, setAnimload] = useState(false);
  const extraClass = animIsLoaded ? "inner-hover": "animate__animated animate__zoomIn";

  useEffect(() => {
    const animTimeout = setTimeout(() => {
      setAnimload(true);
    }, 1500);

    return () => {clearTimeout(animTimeout);}
  }, [setAnimload]);

  return (
    <div id="donate">
      <div id="donate-donate" className={`inner-box ${extraClass}`}>
        <div className="title">حمایت</div>
        <div className="title-info" style={{flexGrow: 1}}>برای حمایت از ما می تونید مبلغ دلخواهی رو به ما اهدا کنید که به ما در تمدید و ارتقا سرور کمک می کنه</div>
        <div id="input-container">
          <input placeholder="مبلغ به تومان" type="number"/>
          <button style={{marginTop: ".25em"}}>ثبت</button>
        </div>
      </div>
      <div id="donate-donators" className={`inner-box ${extraClass} animate__delay-1s`}>
        <div className="title">حامیان مالی</div>
        <div id="donators">
          {donators.map((val, index) => 
            <div key={index} className="donator-layout">
              <div>{val.name}</div>
              <div>{val.amount}</div>
            </div>
          )}
        </div>
      </div>
      <div id="donate-price" className={`inner-box ${extraClass} animate__delay-2s`}>
        <div className="title">جوایز</div>
        <div className="title-info">برای قدردانی، حامیان یک رنک مخصوصی دریافت می کنند</div>
        <HeartPic width={64} height={64}/>
      </div>
    </div>
  )
}

export default Donate;