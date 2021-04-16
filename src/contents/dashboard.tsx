import { useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'

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

function FormatKiloBytes(kilobytes: number, decimals: number = 2): [number, string] {
  let bytes = kilobytes * 1024;
  if (bytes === 0) return [0, ""];

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

function Dashboard(props: {data: ContentState}): JSX.Element{
  // animations overwrite transform transtition so 
  //  we have to remove it class after animations displayed
  const [animIsLoaded, setAnimload] = useState(false);
  
  let data = props.data;
  let extraClass = animIsLoaded ? "inner-hover": "animate__animated animate__zoomIn";

  setTimeout(() => {
    setAnimload(true);
  }, 2500);

  let [netUsageNum, netUsageSign] = FormatKiloBytes(data.netUsage);
  let hasRefid = data.refid !== "";
  let percentage = data.neededPoints === 0? 100: Math.round(data.points*100/data.neededPoints);
  
  let nextRank: string = "از ادمین دریافت کنید";
  let nextRankColor: string = "";
  let canUpgrade: boolean = true;

  for(let rank of data.ranks){
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
      <div id="rankup" className={`inner-box ${extraClass} animate__delay-1s`}>
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
            <div className="rankup-val" style={{direction: "rtl"}}>{data.points}<span id="rankup-val-parser"> / </span>{data.neededPoints === 0? "بی نهایت": data.neededPoints}</div>
          </div>
          <div>
            <div className="rankup-info">رنک بعدی</div>
            <div className="rankup-val">{nextRank}</div>
          </div>
        </div>

        <button disabled={!canUpgrade} style={{
          boxShadow: `0px 0px 20px 0px ${nextRankColor}50`
        }}>ارتقا</button>
      </div>
      <div id="info" className={`inner-box ${extraClass} animate__delay-2s`}>
        <div className="title">اطلاعات این ماه</div>
        <div id="info-content">
          <div className="info-sec">
            <div className="inf">اینترنت مصرف شده</div>
            <div className="val"><span style={{marginRight: "5px"}}>{netUsageNum}</span><span className="sign">{netUsageSign}</span></div>
          </div>
          <div className="info-sec">
            <div className="inf">تایم آنلاینی</div>
            <div className="val">{FormatMinute(data.connTime)}</div>
          </div>
        </div>
      </div>
      <div id="refid" className={`inner-box ${extraClass} animate__delay-3s`}>
        <div className="title">کد دعوت شما</div>
        <div id="refid-info">
        اگر کسی سرور رو به شما معرفی کرده می تونید کد دعوت اون رو وارد کنید تا بهش پوینت برسه همچنین می تونید کد خودتون هم به بقیه بدید
        </div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div id="refid-cldbid">{data.cldbid}</div>
          <input id="refid-refid" type={hasRefid? 'text': 'number'} readOnly={hasRefid} value={hasRefid? data.refid: undefined} placeholder="کد دعوت را وارد کنید" />
          <button disabled={hasRefid}>ثبت کد دعوت</button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;