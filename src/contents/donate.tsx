import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { addAlert } from '../redux/reducers';
import { ReactComponent as HeartPic } from '../images/heart.svg';
import { ChangeEvent } from 'react';

import { API_URL } from '../constants';

function Donate(): JSX.Element{
  const donators = useSelector((state: RootReducer) => state.donators);
  const dispatch = useDispatch();

  const [animIsLoaded, setAnimload] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const extraClass = animIsLoaded ? "inner-hover": "animate__animated animate__zoomIn";

  useEffect(() => {
    const animTimeout = setTimeout(() => {
      setAnimload(true);
    }, 1500);

    return () => {clearTimeout(animTimeout);}
  }, [setAnimload]);

  async function onDonate(){
    if(donationAmount === ""){
      dispatch(addAlert({
        text: "اول مبلغ حمایت رو وارد کن",
        durationSecond: 5,
        type: "info"
      }));
      return;
    }

    if(parseInt(donationAmount) < 3000){
      dispatch(addAlert({
        text: "حداقل مبلغ حمایت 3000 تومان می باشد",
        durationSecond: 5,
        type: "danger"
      }));
      return;
    }

    const response = await fetch(`${API_URL}/submitdonation/${donationAmount}`);
    if(!response.ok){
      dispatch(addAlert({
        text: "مشکل در برقراری ارتباط با سرور",
        durationSecond: 5,
        type: "danger"
      }));
      return;
    }

    const data = await response.json();
    let result = data["result"];

    if(result !== 0){
      let errors: string[] = [
        "مشکلی پیش اومده لطفا صفحه را رفرش کنید",
        `مشکلی پیش اومده لطفا آن را با ادمین درمیان بگذارید، کد ارور: ${data["url"]}`
      ];

      dispatch(addAlert({
        text: errors[result],
        durationSecond: 15,
        type: "danger"
      }));
      return;
    }

    dispatch(addAlert({
      text: 'در حال انتقال به درگاه پرداخت',
      durationSecond: 2000,
      type: "success",
      extraClass: "animate__animated animate__pulse animate__infinite"
    }));
    window.location.href = data["url"];
  }

  return (
    <div id="donate">
      <div id="donate-donate" className={`inner-box ${extraClass}`}>
        <div className="title">حمایت</div>
        <div className="title-info" style={{flexGrow: 1}}>برای حمایت از ما می تونید مبلغ دلخواهی رو به ما اهدا کنید که به ما در تمدید و ارتقا سرور کمک می کنه</div>
        <div id="input-container">
          <input onInput={
            (ev: ChangeEvent<HTMLInputElement>) => {
              let newAmount = (ev.target.validity.valid) ? ev.target.value: donationAmount;
              setDonationAmount(newAmount);
            } 
          } pattern="[0-9]*" placeholder="مبلغ به تومان" type="text" value={donationAmount} />
          <button style={{marginTop: ".25em"}} onClick={onDonate}>ثبت</button>
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