import { useDispatch, useSelector } from 'react-redux';
import { type RootReducer, clientInfo } from '../../redux/reducers';
import { addAlert, fetchWrapper, clamp } from '../../utils';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'

interface Rank {
  id: number,
  name: string,
  color: string,
  upgradable?: boolean
};

const ranks: Rank[] = [
  { id:  7, name: "Member",       color: "#ffffff", upgradable: true },
  { id: 20, name: "Vip",          color: "#0090d9", upgradable: true }, 
  { id: 21, name: "Vip+",         color: "#2dc7db", upgradable: true },
  { id: 22, name: "Vip++",        color: "#0170db", upgradable: true },
  { id: 23, name: "Mvp",    color: "#1d2027", upgradable: true },
  { id: 24, name: "Mvp+",       color: "#930af5", upgradable: true },
  { id: 25, name: "Mvp++",   color: "#f500ed" },
  { id: 26, name: "Prime",    color: "#00ba1f" },
  { id: 27, name: "Moderator",    color: "#00fa2a" },
  { id:  9, name: "Owner",        color: "#800f05" }
];

export default function RankStatus() {
  const { ranks: clientRanks, points, neededPoints } = useSelector((state: RootReducer) => state.clientInfo);
  const dispatch = useDispatch();

  const percentage = clamp(
    neededPoints == 0 ? 100 : Math.floor(points * 100 / neededPoints),
    0, 100
  );
  let nowRank = ranks.find(val => clientRanks.includes(val.id)) || ranks[0];
  let nextRank = calNextRank();
  
  async function onUpgrade() {
    if (points < neededPoints) {
      addAlert({
        text: `برای ارتقا به ${neededPoints} پوینت نیاز داری که الان ${points} تاشو جم کردی، یه روزی بالاخره ${nextRank.name} میشی 😔`,
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

    let _nowRanks: number[] = data["now-ranks"];
    dispatch(clientInfo.actions.rankup({
      points: data["now-point"],
      neededPoints: data["now-needed-point"],
      ranks: _nowRanks
    }));

    let _nextRank = calNextRank(_nowRanks);
    
    // send '+' symbols in ranks name to left because name renders in rtl
    let regMatch = nextRank.name.match(/(?<rankName>\w+)(?<plusses>\++)/)
    if (regMatch?.groups) {
      let { rankName, plusses } = regMatch.groups;
      nextRank.name = plusses + rankName;
    }

    let celebrateMsg = _nextRank.upgradable ? `با موفقیت ارتقا یافتی، مبارکت باشه، ایشالا ${_nextRank.name} شدنت رو ببینم` : "با موفقیت ارتقا یافتی، ولی متاسفم که باید بهت بگم این آخرین رنکی بود که به صورت اتوماتیک می تونستی دریافت کنی، از اینجا به بعد باید از ادمین رنک بگیری 😔";
    addAlert({
      text: celebrateMsg,
      type: "success"
    }, 15);
  }

  function calNextRank(selectedRanks: number[] = clientRanks): Rank {
    for (let [index, rank] of ranks.entries()) {
      if (selectedRanks.includes(rank.id))
        return rank.upgradable ? ranks[index + 1] : rank;
    }

    return ranks[0];
  }

  document.documentElement.style
    .setProperty('--rank-color', nextRank.color);

  return (
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
            {points.toLocaleString()}
            <span id="rankup-val-parser"> / </span>
            {neededPoints == 0 ? "بی نهایت" : neededPoints.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="rankup-info">رنک بعدی</div>
          <div className="rankup-val">{nowRank.upgradable ? nextRank.name : "از ادمین دریافت کنید"}</div>
        </div>
      </div>

      <button onClick={onUpgrade} disabled={!nowRank.upgradable} style={{
        boxShadow: `0px 0px 20px 0px ${nowRank.upgradable ? nextRank.color : nowRank.color}50`
      }}>ارتقا</button>
    </div>
  );
}
