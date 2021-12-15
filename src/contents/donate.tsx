import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as HeartPic } from '../images/heart.svg';
import { ChangeEvent } from 'react';

import { fetchWrapper, addAlert } from '../tools'

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

function Donate(): JSX.Element{
  const donators = useSelector((state: RootReducer) => state.donators);

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
      addAlert({
        text: "اول مبلغ حمایت رو وارد کن",
        type: "info"
      }, 5);
      return;
    }

    let amount: number = parseInt(donationAmount);
    if(amount < 10_000){
      addAlert({
        text: "حداقل مبلغ حمایت 10,000 تومان هست، میشه پوله یه آبنبات 🍭",
        type: "info"
      }, 10);
      return;
    }

    if(amount > 1_000_000){
      addAlert({
        text: "داداش پولات تموم میشه نمی خواد اینقدر کمک کنی، زیر یک میلیون بزن 😎",
        type: "info"
      }, 10);
      return;
    }

    try {
      var response = await fetchWrapper("submit_donation", {
        method: "POST",
        data: { "amount": donationAmount }
      });
    } catch(err: any) {
      addAlert({
        text: err,
        type: "danger",
      }, 15);
      return;
    }

    const data = await response.json();
    if(!data["success"]){
      addAlert({
        text: `ارور ${data["hint"]}، ساخت درگاه پرداخت با مشکل مواجه شد لطفا با ادمین درمیون بزارید`,
        type: "danger"
      }, 20);
      return;
    }

    addAlert({
      text: 'در حال انتقال به درگاه پرداخت',
      type: "success",
      extraClass: "animate__animated animate__pulse animate__infinite"
    }, 100);
    window.location.href = `https://www.zarinpal.com/pg/StartPay/${data["authority"]}`;
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
        <SimpleBar id="donators" autoHide={false}>
          {donators.map((val, index) => 
            <div key={index} className="donator-layout">
              <div>{val.name}</div>
              <div>{val.amount}</div>
            </div>
          )}
        </SimpleBar>
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