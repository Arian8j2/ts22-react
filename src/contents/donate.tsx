import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type RootReducer } from '../redux/reducers';

import { ReactComponent as HeartPic } from '../images/heart.svg';
import { ChangeEvent } from 'react';

import { fetchWrapper, addAlert } from '../utils';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

function Donate(): JSX.Element{
  const donators = useSelector((state: RootReducer) => state.clientInfo.donators);
  const [amount, setAmount] = useState<number>();

  async function onDonate() {
    if (!amount) {
      addAlert({ text: "اول مبلغ حمایت رو وارد کن", type: "info" }, 5);
      return;
    }

    if (amount < 60_000) {
      addAlert({
        text: "حداقل مبلغ حمایت 60,000 تومان هست، میشه پوله یه آبنبات 🍭",
        type: "info"
      }, 10);
      return;
    }

    if (amount > 1_000_000) {
      addAlert({
        text: "داداش پولات تموم میشه نمی خواد اینقدر کمک کنی، زیر یک میلیون بزن 😎",
        type: "info"
      }, 10);
      return;
    }

    try {
      var response = await fetchWrapper("submit_donation", {
        method: "POST",
        data: { "amount": amount }
      });
    } catch (err: any) {
      addAlert({
        text: err,
        type: "danger",
      }, 15);
      return;
    }

    const data = await response.json();
    if (!data["success"]) {
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
      <div id="donate-donate" className="inner-box animate__animated animate__zoomIn">
        <div className="title">حمایت</div>
        <div className="title-info" style={{flexGrow: 1}}>برای حمایت از ما می تونید مبلغ دلخواهی رو به ما اهدا کنید که به ما در تمدید و ارتقا سرور کمک می کنه</div>
        <div id="input-container">
          <input onInput={
            (ev: ChangeEvent<HTMLInputElement>) => {
              let newAmount = ev.target.value.replaceAll(",", "")
              if (newAmount.match(/[0-9]*/))
                setAmount(parseInt(newAmount));
            } 
          } placeholder="مبلغ به تومان" type="text" value={amount ? amount.toLocaleString() : ""} />
          <button style={{marginTop: ".25em"}} onClick={onDonate}>ثبت</button>
        </div>
      </div>
      <div id="donate-donators" className="inner-box animate__animated animate__zoomIn animate__delay-1s">
        <div className="title">حامیان مالی</div>
        <SimpleBar id="donators" autoHide={false}>
          {donators.map((val, index) => 
            <div key={index} className="donator-layout">
              <div>{val.name}</div>
              <div>{val.amount.toLocaleString()}</div>
            </div>
          )}
        </SimpleBar>
      </div>
      <div id="donate-price" className="inner-box animate__animated animate__zoomIn animate__delay-2s">
        <div className="title">جوایز</div>
        <div className="title-info">برای قدردانی، حامیان یک رنک مخصوصی دریافت می کنند</div>
        <HeartPic width={64} height={64}/>
      </div>
    </div>
  )
}

export default Donate;
