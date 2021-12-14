import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { addAlert } from '../redux/reducers';
import { ReactComponent as HeartPic } from '../images/heart.svg';
import { ChangeEvent } from 'react';

import { fetchWrapper } from '../tools'

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

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

    let amount: number = parseInt(donationAmount);
    if(amount < 10_000){
      dispatch(addAlert({
        text: "حداقل مبلغ حمایت 10,000 تومان هست، میشه پوله یه آبنبات 🍭",
        durationSecond: 10,
        type: "info"
      }));
      return;
    }

    if(amount > 1_000_000){
      dispatch(addAlert({
        text: "داداش پولات تموم میشه نمی خواد اینقدر کمک کنی، زیر یک میلیون بزن 😎",
        durationSecond: 10,
        type: "info"
      }));
      return;
    }

    try {
      var response = await fetchWrapper("submit_donation", {
        method: "POST",
        data: { "amount": donationAmount }
      });
    } catch(err: any) {
      dispatch(addAlert({
        text: err,
        type: "danger",
        durationSecond: 15
      }));
      return;
    }

    const data = await response.json();
    if(!data["success"]){
      dispatch(addAlert({
        text: `ارور ${data["hint"]}، ساخت درگاه پرداخت با مشکل مواجه شد لطفا با ادمین درمیون بزارید`,
        durationSecond: 30,
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