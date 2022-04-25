import { useState, ChangeEvent } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'

import { useSelector, useDispatch } from 'react-redux';
import { clientInfo as clientInfoReducer, type RootReducer } from '../redux/reducers';

import { fetchWrapper, addAlert, clamp, formatNetUsage, formatConnTime } from '../utils';

interface Rank {
  id: number,
  name: string,
  color: string,
  upgradable?: boolean
};

const ranks: Rank[] = [
  { id: 124, name: "Member",       color: "#ffffff", upgradable: true },
  { id: 185, name: "Elite",        color: "#f29929", upgradable: true },
  { id: 171, name: "Vip",          color: "#0090d9", upgradable: true }, 
  { id: 131, name: "Vip+",         color: "#2dc7db", upgradable: true },
  { id: 172, name: "Vip++",        color: "#0170db", upgradable: true },
  { id: 183, name: "Assistant",    color: "#1d2027", upgradable: true },
  { id: 186, name: "Helper",       color: "#930af5", upgradable: true },
  { id: 184, name: "Consultant",   color: "#f500ed" },
  { id: 130, name: "Supporter",    color: "#00ba1f" },
  { id: 129, name: "Moderator",    color: "#00fa2a" },
  { id: 181, name: "Manager",      color: "#007a14" },
  { id: 180, name: "Developer",    color: "#b38a2b" },
  { id: 179, name: "Sub Admin",    color: "#fac219" },
  { id: 178, name: "Admin",        color: "#fa7325" },
  { id: 127, name: "Head Admin",   color: "#fa5d0b" },
  { id: 182, name: "Server Admin", color: "#fa1f0b" },
  { id: 123, name: "Owner",        color: "#800f05" }
];

export default function Dashboard() {
  const clientInfo = useSelector((state: RootReducer) => state.clientInfo);
  const dispatch = useDispatch();

  let [refidInput, setRefidInput] = useState("");
  let [netUsageValue, netUsageSign] = formatNetUsage(clientInfo.netUsage).split(" ");
  let hasRefid = clientInfo.refid != "";
  let percentage = clamp(clientInfo.neededPoints == 0 ? 100:
    Math.floor(clientInfo.points * 100 / clientInfo.neededPoints), 0, 100);

  let nowRank = ranks.find(val => clientInfo.ranks.includes(val.id)) || ranks[0];
  let nextRank = calNextRank();
  
  async function onSubmitRefid() {
    if (!refidInput) {
      addAlert({
        text: "اگه کسی بهت سرور رو معرفی کرده می تونی کد دعوت شو ازش بگیری و اینجا وارد کنی تا بهش پوینت برسه",
        type: "info"
      }, 10);
      return;
    }

    const refid = parseInt(refidInput);
    if (refid == clientInfo.cldbid){
      addAlert({
        text: "باو این کد خودته یعنی این کد رو باید دوستات بزنن تا به تو پوینت برسه، تو هم باید کد بقیه رو بزنی نه کد خودت 😐",
        type: "info"
      }, 10);
      return;
    }

    try {
      var response = await fetchWrapper("submit_refid", {
        method: "POST",
        data: { refid }
      });
    } catch (err: any) {
      addAlert({
        text: err,
        type: "danger"
      }, 15);
      return;
    }

    let data = await response.json();
    if (data["success"]) {
      let refName: string = data["name"];
      addAlert({
        text: `کد دعوت با موفقیت ثبت شد، همچنین به ${refName} هم بخاطر دعوتش پوینت رسید، خوشحال نشو به تو که چیزی نمی رسه، اون دعوتت کرده 😊 `,
        type: "success"
      }, 15);
      dispatch(clientInfoReducer.actions.setRefid(refName));
    } else {
      const errors: Record<number, string> = {
        1: "کد کسی که وارد می کنید باید داخل سرور باشد",
        2: "به نظر هر دوتاتون یه نفر هستین، اگه اشتباهی شده با ادمین درمیون بزار",
        4: `${data["name"]} دیگه نمی تونه کسیو دعوت کنه، بسشه دیگه. کد یکی دیگه رو بزن`
      };
      let errorMsg: string = data["hint"] in errors ? errors[data["hint"]] : "مشکلی بوجود اومده لطفا صفحه را رفرش کنید!"; 

      addAlert({
        text: errorMsg,
        type: "danger"
      }, 10);
    }
  }

  async function onUpgradeRank() {
    if (clientInfo.points < clientInfo.neededPoints) {
      addAlert({
        text: `برای ارتقا به ${clientInfo.neededPoints} پوینت نیاز داری که الان ${clientInfo.points} تاشو جم کردی، یه روزی بالاخره ${nextRank} میشی 😔`,
        type: "info"
      }, 10);
      return;
    }

    try {
      var response = await fetchWrapper("upgrade", { method: "POST" });
    } catch (err: any) {
      addAlert({
        text: err,
        type: "danger",
      }, 15);
      return;
    }

    let data = await response.json();
    if (!data["success"]) {
      addAlert({
        text: "مشکلی بوجود اومده لطفا صفحه را رفرش کنید!",
        type: "danger"
      }, 10);
    }

    let nowRanks: number[] = data["now-ranks"];
    dispatch(clientInfoReducer.actions.rankup({
      points: data["now-point"],
      neededPoints: data["now-needed-point"],
      ranks: nowRanks
    }));

    let newNextRank = calNextRank(nowRanks);
    let regMatch = newNextRank.name.match(/(?<rankName>\w+)(?<extra>\++)/)
    if (regMatch?.groups) {
      let {rankName, extra} = regMatch.groups;
      newNextRank.name = extra + rankName;
    }

    let celebrateMsg = newNextRank.upgradable ? `با موفقیت ارتقا یافتی، مبارکت باشه، ایشالا ${newNextRank.name} شدنت رو ببینم` : "با موفقیت ارتقا یافتی، ولی متاسفم که باید بهت بگم این آخرین رنکی بود که به صورت اتوماتیک می تونستی دریافت کنی، از اینجا به بعد باید از ادمین رنک بگیری 😔";
    addAlert({
      text: celebrateMsg,
      type: "success"
    }, 15);
  }

  function calNextRank(clientRanks: number[] = clientInfo.ranks): Rank {
    for (let [index, rank] of ranks.entries()) {
      if (clientRanks.includes(rank.id))
        return rank.upgradable ? ranks[index + 1] : rank;
    }

    return ranks[0];
  }

  document.documentElement.style
    .setProperty('--rank-color', nextRank.color);

  return (
    <div id="dashboard">
      <div id="rankup" className="inner-box animate__animated animate__zoomIn">
        <div style={{width: "75%", height: "50%"}}>
          <CircularProgressbarWithChildren value={percentage} strokeWidth={2.8} styles={buildStyles({
            pathColor: nextRank.color,
            trailColor: "#2d3139",
            strokeLinecap: "round",
            pathTransition: "1s",
            pathTransitionDuration: 1
          })}>
            <div id="rankup-percent">
              {percentage}
            </div>
          </CircularProgressbarWithChildren>
        </div>

        <div style={{marginTop: "15px", flexGrow: 1}}>
          <div>
            <div className="rankup-info">پوینت های شما</div>
            <div className="rankup-val" style={{direction: "rtl"}}>
              {clientInfo.points}
              <span id="rankup-val-parser"> / </span>
              {clientInfo.neededPoints === 0? "بی نهایت": clientInfo.neededPoints}
            </div>
          </div>
          <div>
            <div className="rankup-info">رنک بعدی</div>
            <div className="rankup-val">{nowRank.upgradable ? nextRank.name : "از ادمین دریافت کنید"}</div>
          </div>
        </div>

        <button onClick={onUpgradeRank} disabled={!nowRank.upgradable} style={{
          boxShadow: `0px 0px 20px 0px ${nowRank.upgradable ? nextRank.color : nowRank.color}50`
        }}>ارتقا</button>
      </div>
      <div id="info" className="inner-box animate__animated animate__zoomIn animate__delay-1s">
        <div className="title">اطلاعات این ماه</div>
        <div id="info-content">
          <div className="info-sec">
            <div className="inf">اینترنت مصرف شده</div>
            <div className="val">
              <span style={{marginRight: netUsageSign.length ? "3px": "0px"}}>
                {netUsageValue}
              </span>
              <span className="sign">{netUsageSign}</span>
            </div>
          </div>
          <div className="info-sec">
            <div className="inf">تایم آنلاینی</div>
            <div className="val">{formatConnTime(clientInfo.connTime)}</div>
          </div>
        </div>
      </div>
      <div id="refid" className="inner-box animate__animated animate__zoomIn animate__delay-2s">
        <div className="title">کد دعوت شما</div>
        <div id="refid-info">
        اگر کسی سرور رو به شما معرفی کرده می تونید کد دعوت اون رو وارد کنید تا بهش پوینت برسه همچنین می تونید کد خودتون هم به بقیه بدید
        </div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div id="refid-cldbid">{clientInfo.cldbid}</div>
          <input onInput={(ev: ChangeEvent<HTMLInputElement>) => {
            let newRefid = ev.target.validity.valid ? ev.target.value : refidInput;
            setRefidInput(newRefid);
          }}
            pattern="[0-9]*" id="refid-refid" type="text" readOnly={hasRefid}
            value={hasRefid? clientInfo.refid: refidInput} placeholder="کد دعوت را وارد کنید" />
          <div style={{flexGrow: 1, visibility: "hidden"}} >a</div>
          <button disabled={hasRefid} onClick={onSubmitRefid}>ثبت کد دعوت</button>
        </div>
      </div>
    </div>
  );
}