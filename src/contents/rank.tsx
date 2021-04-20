import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from '../redux/reducers';

const maxGameRanks: number = 3;
const doNotDisturbId: number = 999;

interface RankInfo{
  id: number,
  name: string,
  color: "blue" | "red" | "yellow" | "green" | "grey"
};

const gameRanks: RankInfo[] = [
  {id: 43, name: "Dota 2", color: "red"},
  {id: 44, name: "Call Of Duty", color: "green"},
  {id: 68, name: "Fortnite", color: "blue"},
  {id: 47, name: "DDNet", color: "yellow"},
  {id: 45, name: "Minecraft", color: "green"},
  {id: 48, name: "World Of Warcraft", color: "yellow"},
  {id: 50, name: "Rust", color: "red"},
  {id: 51, name: "Zula", color: "grey"},
  {id: 52, name: "League Of Legends", color: "blue"},
  {id: 65, name: "PUBG", color: "yellow"},
  {id: 46, name: "Gta V", color: "green"},
  {id: 87, name: "Garry's Mod", color: "blue"},
  {id: 49, name: "Counter Strike", color: "yellow"},
  {id: 85, name: "Apex Legends", color: "red"},
  {id: 86, name: "Rocket League", color: "blue"},
  {id: 88, name: "Rainbow Six Siege", color: "grey"},
  {id: 106, name: "Hyperscape", color: "yellow"},
  {id: 105, name: "Valorant", color: "red"}
];

const privacyRanks: RankInfo[] = [
  {id: 34, name: "Anti Poke", color: "yellow"},
  {id: 33, name: "Anti Pm", color: "yellow"},
  {id: doNotDisturbId, name: "Do Not Disturb", color: "red"},
  {id: 92, name: "Anti Move", color: "yellow"},
]

const sections: {htmlId: string, title: string, ranks: RankInfo[]}[] = [
  {
    htmlId: "rank-game",
    title: "بازی",
    ranks: gameRanks
  },
  {
    htmlId: "rank-privacy",
    title: "حریم شخصی",
    ranks: privacyRanks
  }
];

function Rank(): JSX.Element{
  const savedRanks: number[] = useSelector((state: RootReducer) => state.clientInfo.ranks);
  const dispatch = useDispatch();

  const [nowRanks, setNowRanks] = useState(savedRanks);
  const [animIsLoaded, setAnimload] = useState(false);
  const extraClass = animIsLoaded ? "inner-hover": "animate__animated animate__zoomIn";

  useEffect(() => {
    let animTimeout = setTimeout(() => {
      setAnimload(true);
    }, 2000);

    let updateRanksInterval = setInterval(() => {
      if(nowRanks !== savedRanks){
        (async () => {
          // TODO: send update rank request and then dispatch new ranks
        })();
      }
    }, 2000);


    return () => {
      clearTimeout(animTimeout);
      clearInterval(updateRanksInterval);
    }
  }, [setAnimload, nowRanks, savedRanks]);

  function onRankClick(rankId: number){
    let buffer: number[] = nowRanks.slice();
    
    if(nowRanks.includes(rankId)){
      buffer = buffer.filter((val) => {
        return val !== rankId;
      });
    }else{
      buffer.push(rankId);
      
      let privaciesRanksId: number[] = [];
      let hasDnd = false;

      for(let rank of privacyRanks){
        if(buffer.includes(rank.id)){
          if(rank.id === doNotDisturbId){
            hasDnd = true;
            continue;
          }

          privaciesRanksId.push(rank.id);
        }
      }

      console.log(privaciesRanksId);

      if(privaciesRanksId.length === 3){
        buffer = buffer.filter((val) => !(privaciesRanksId.includes(val)));
        buffer.push(doNotDisturbId);

        dispatch(addAlert({
          text: `رنک Do Not Disturb همه رنک های حریم شخصی رو در بر داره پس بجای سه تا رنک بهت این رنک طلایی رو میدم، قابل نداره`,
          durationSecond: 15,
          type: "info"
        }));
      } else if(hasDnd && privaciesRanksId.includes(rankId)) {
        dispatch(addAlert({
          text: `رنک Do Not Disturb همه رنک های حریم شخصی رو در بر داره پس ابتدا رنک Do Not Disturb رو از خودت بگیر`,
          durationSecond: 10,
          type: "danger"
        }));
        return;
      }

      


      let gameRankCount = 0;
      for(let rank of gameRanks){
        if(buffer.includes(rank.id))
          gameRankCount++;
      }

      if(gameRankCount > maxGameRanks){
        dispatch(addAlert({
          text: `نمی تونی بیشتر از ${maxGameRanks} رنک بازی به خودت بدی`,
          durationSecond: 5,
          type: "danger"
        }));
        return;
      }
    }

    setNowRanks(buffer);
  }

  return (
    <div id="rank">
      {sections.map((val, index) =>
        <div key={index} id={val.htmlId} className={`inner-box ${extraClass} ${index>0? "animate__delay-" + index + "s": ""}`}>
          <div className="title">{val.title}</div>
          <div className="rank-buttons">
            {val.ranks.map((val) =>
              <button key={val.id} onClick={() => {onRankClick(val.id)}} className={`btn${nowRanks.includes(val.id) ? "": "-outline"}-${val.color}`}>
                {val.name}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Rank;