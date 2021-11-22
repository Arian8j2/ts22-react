import { useState, useEffect, ChangeEvent } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'

import { useSelector, useDispatch } from 'react-redux';
import { addAlert, setClientRefid, setClientInfoAfterRankUp } from '../redux/reducers';

import { API_URL } from '../constants';

const RankColors: Record<number, {name: string, color: string}> = {
  16: {
    name: "Elite", 
    color: "#F29929"
  },
  77: {
    name: "Vip", 
    color: "#0090D9" 
  },
  63: {
    name: "Vip+", 
    color: "#2DC7DB"
  },
  23: {
    name: "Vip++",
    color: "#0170DB"
  },
  64: {
    name: "Assistant",
    color: "#1D2027"
  },
  75: {
    name: "Helper",
    color: "#930AF5"
  },
  78: {
    name: "Consultant",
    color: "#F500ED"
  }
};

const NotUpgradableRanksColor: Record<number, string> = {
  76: "#F500ED", // consultant
  22: "#00BA1F", // supporter
  21: "#00FA2A", // moderator
  73: "#007A14", // manager
  72: "#B38A2B", // developer
  71: "#FAC219", // sub admin
  70: "#FA7325", // admin
  19: "#FA5D0B", // head admin
  74: "#FA1F0B", // server admin
  15: "#800F05", // owner
};

function FormatKiloBytes(kilobytes: number, decimals: number = 2): [number | string, string] {
  let bytes = kilobytes * 1024;
  if (bytes === 0) return ["صفر", ""];

  const k = 1024;
  let dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // not show decimals of MB and lower
  if(i < 3)
    dm = 0;

  return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), sizes[i]];
}

function FormatMinute(minute: number): string {
  if(minute === 0)
    return "صفر"

  let buffer = [];
  
  let days = Math.floor(minute / 60 / 24);
  if(days){
    buffer.push(`${days} روز`);
    minute -= days * 24 * 60;
  }
  
  let hours = Math.floor(minute / 60);
  if(hours){
    buffer.push(`${hours} ساعت`);
    minute -= hours * 60;
  }

  if(minute && buffer.length !== 2){
    buffer.push(`${minute} دقیقه`);
  }
  return buffer.join(" و ");
}

function Dashboard(){
  /* animations overwrite transform transtition so 
     i have to remove it class after animations displayed */
  const [animIsLoaded, setAnimload] = useState(false);
  const [refid, setRefid] = useState("");

  const clientInfo = useSelector((state) => (state as RootReducer).clientInfo);
  const dispatch = useDispatch();

  let extraClass = animIsLoaded ? "inner-hover": "animate__animated animate__zoomIn";
  
  useEffect(() => {
    let animTimeout = setTimeout(() => {
      setAnimload(true);
    }, 1500);

    return () => {clearTimeout(animTimeout);}
  }, [setAnimload]);

  
  let [netUsageNum, netUsageSign] = FormatKiloBytes(clientInfo.netUsage);
  let hasRefid = clientInfo.refid !== "";

  let percentage = clientInfo.neededPoints === 0? 100: Math.round(clientInfo.points*100/clientInfo.neededPoints);
  if(percentage > 100)
    percentage = 100;
  else if(percentage < 0)
    percentage = 0;

  let nextRank: string = "از ادمین دریافت کنید";
  let nextRankColor: string = "";
  let canUpgrade: boolean = true;

  
  async function onSubmitRefid(){
    if(refid === ""){
      dispatch(addAlert({
        text: "اگه کسی بهت سرور رو معرفی کرده می تونی کد دعوت شو ازش بگیری و اینجا وارد کنی تا بهش پوینت برسه",
        durationSecond: 10,
        type: "info"
      }));
      return;
    }

    if(parseInt(refid) === clientInfo.cldbid){
      dispatch(addAlert({
        text: "باو این کد خودته یعنی این کد رو باید دوستات بزنن تا به تو پوینت برسه، تو هم باید کد بقیه رو بزنی نه کد خودت 😐",
        durationSecond: 12,
        type: "danger"
      }));
      return;
    }

    let response = await fetch(`${API_URL}/submit_refid/${refid}`);
    if(!response.ok){
      dispatch(addAlert({
        text: "مشکل در برقراری ارتباط با سرور",
        durationSecond: 5,
        type: "danger"
      }));
      return;
    }

    let data = await response.json();
    if(data["success"]){

      let refName: string = data["name"];
      dispatch(addAlert({
        text: `کد دعوت با موفقیت ثبت شد، همچنین به ${refName} هم بخاطر دعوتش پوینت رسید، خوشحال نشو به تو که چیزی نمی رسه، اون دعوتت کرده 😊 `,
        durationSecond: 15,
        type: "success"
      }));
      dispatch(setClientRefid(refName));

    } else {
      const errors: Record<number, string> = {
        1: "کد کسی که وارد می کنید باید داخل سرور باشد",
        2: "به نظر هر دوتاتون یه نفر هستین، اگه اشتباهی شده با ادمین درمیون بزار",
        4: `${data["name"]} دیگه نمی تونه کسیو دعوت کنه، بسشه دیگه. کد یکی دیگه رو بزن`,
        5: `مشکلی بوجود اومده لطفا به ${data["name"]} بگید که یکبار از سایت دیدن کنه و بعد دوباره تلاش کنید`
      };
      let errorMsg: string = data["hint"] in errors? errors[data["hint"]] : "مشکلی بوجود اومده لطفا صفحه را رفرش کنید!"; 

      dispatch(addAlert({
        text: errorMsg,
        durationSecond: 10,
        type: "danger"
      }));
    }
  }

  async function onUpgradeRank(){
    if(clientInfo.points < clientInfo.neededPoints){
      dispatch(addAlert({
        text: `برای ارتقا به ${clientInfo.neededPoints} پوینت نیاز داری که الان ${clientInfo.points} تاشو جم کردی، یه روزی بالاخره ${nextRank} میشی 😔`,
        durationSecond: 10,
        type: "info"
      }));
      return;
    }

    let response = await fetch(`${API_URL}/upgrade`);
    if(!response.ok){
      dispatch(addAlert({
        text: "مشکل در برقراری ارتباط با سرور",
        durationSecond: 5,
        type: "danger"
      }));
      return;
    }

    let data = await response.json();
    if(data["success"]){
      let nowRanks: number[] = [];
      for(let rank of (data["now-rank"] as string).split(","))
        nowRanks.push(parseInt(rank));

      dispatch(setClientInfoAfterRankUp({
        points: data["now-point"],
        neededPoints: data["now-needed-point"],
        ranks: nowRanks
      }));

      let nowNextRank = "";
      for(let rank of nowRanks){
        if(rank in RankColors){
          nowNextRank = RankColors[rank].name;
          break;
        }
      }

      let celebrateMsg = nowNextRank === "" ?
        "با موفقیت ارتقا یافتی، ولی متاسفم که باید بهت بگم این آخرین رنکی بود که به صورت اتوماتیک می تونستی دریافت کنی، از اینجا به بعد باید از ادمین رنک بگیری 😔"
      :
        `با موفقیت ارتقا یافتی، مبارکت باشه، ایشالا ${nowNextRank} شدنت رو ببینم`;

      dispatch(addAlert({
        text: celebrateMsg,
        durationSecond: 15,
        type: "success"
      }));
    } else {
      dispatch(addAlert({
        text: "مشکلی بوجود اومده لطفا صفحه را رفرش کنید!",
        durationSecond: 10,
        type: "danger"
      }))
    }
  }

  for(let rank of clientInfo.ranks){
    if(rank in RankColors){
      nextRank = RankColors[rank].name;      
      nextRankColor = RankColors[rank].color;
      break;
    }

    if(rank in NotUpgradableRanksColor){
      canUpgrade = false;
      nextRankColor = NotUpgradableRanksColor[rank];
      break;
    }
  }

  document.documentElement.style
    .setProperty('--rank-color', nextRankColor);

  return (
    <div id="dashboard">
      <div id="rankup" className={`inner-box ${extraClass}`}>
        <div style={{width: "75%", height: "50%"}}>
          <CircularProgressbarWithChildren value={percentage} strokeWidth={2.8} styles={buildStyles({
            pathColor: nextRankColor,
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
            <div className="rankup-val" style={{direction: "rtl"}}>{clientInfo.points}<span id="rankup-val-parser"> / </span>{clientInfo.neededPoints === 0? "بی نهایت": clientInfo.neededPoints}</div>
          </div>
          <div>
            <div className="rankup-info">رنک بعدی</div>
            <div className="rankup-val">{nextRank}</div>
          </div>
        </div>

        <button onClick={onUpgradeRank} disabled={!canUpgrade} style={{
          boxShadow: `0px 0px 20px 0px ${nextRankColor}50`
        }}>ارتقا</button>
      </div>
      <div id="info" className={`inner-box ${extraClass} animate__delay-1s`}>
        <div className="title">اطلاعات این ماه</div>
        <div id="info-content">
          <div className="info-sec">
            <div className="inf">اینترنت مصرف شده</div>
            <div className="val"><span style={{marginRight: typeof(netUsageNum) == "string" ? "0px": "5px"}}>{netUsageNum}</span><span className="sign">{netUsageSign}</span></div>
          </div>
          <div className="info-sec">
            <div className="inf">تایم آنلاینی</div>
            <div className="val">{FormatMinute(clientInfo.connTime)}</div>
          </div>
        </div>
      </div>
      <div id="refid" className={`inner-box ${extraClass} animate__delay-2s`}>
        <div className="title">کد دعوت شما</div>
        <div id="refid-info">
        اگر کسی سرور رو به شما معرفی کرده می تونید کد دعوت اون رو وارد کنید تا بهش پوینت برسه همچنین می تونید کد خودتون هم به بقیه بدید
        </div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div id="refid-cldbid">{clientInfo.cldbid}</div>
          <input onInput={(ev: ChangeEvent<HTMLInputElement>) => {
            let newRefid = (ev.target.validity.valid) ? ev.target.value: refid;
            setRefid(newRefid);
          }}
            pattern="[0-9]*" id="refid-refid" type="text" readOnly={hasRefid} value={hasRefid? clientInfo.refid: refid} placeholder="کد دعوت را وارد کنید" />
          <div style={{flexGrow: 1, visibility: "hidden"}} >a</div>
          <button disabled={hasRefid} onClick={onSubmitRefid}>ثبت کد دعوت</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;