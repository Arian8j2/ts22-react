import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setClientRanks } from '../redux/reducers';
import { fetchWrapper, addAlert } from '../tools'

const maxGameRanks: number = 3;
const doNotDisturbId: number = 215;

interface RankInfo{
  id: number,
  name: string,
  color: "blue" | "red" | "yellow" | "green" | "grey"
};

const gameRanks: RankInfo[] = [
  {id: 151, name: "Dota 2", color: "red"},
  {id: 152, name: "Call Of Duty", color: "green"},
  {id: 176, name: "Fortnite", color: "blue"},
  {id: 155, name: "DDNet", color: "yellow"},
  {id: 153, name: "Minecraft", color: "green"},
  {id: 156, name: "World Of Warcraft", color: "yellow"},
  {id: 158, name: "Rust", color: "red"},
  {id: 159, name: "Zula", color: "grey"},
  {id: 160, name: "League Of Legends", color: "blue"},
  {id: 173, name: "PUBG", color: "yellow"},
  {id: 154, name: "Gta V", color: "green"},
  {id: 195, name: "Garry's Mod", color: "blue"},
  {id: 157, name: "Counter Strike", color: "yellow"},
  {id: 193, name: "Apex Legends", color: "red"},
  {id: 194, name: "Rocket League", color: "blue"},
  {id: 196, name: "Rainbow Six Siege", color: "grey"},
  {id: 214, name: "Hyperscape", color: "yellow"},
  {id: 213, name: "Valorant", color: "red"}
];

const privacyRanks: RankInfo[] = [
  {id: 142, name: "Anti Poke", color: "yellow"},
  {id: 141, name: "Anti Pm", color: "yellow"},
  {id: doNotDisturbId, name: "Do Not Disturb", color: "red"},
  {id: 200, name: "Anti Move", color: "yellow"},
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
  const remainedRanks = useRef<null | number[]>(null);
  const [nowRanks, setNowRanks] = useState(savedRanks);
  const [animIsLoaded, setAnimload] = useState(false);
  const extraClass = animIsLoaded ? "inner-hover": "animate__animated animate__zoomIn";

  const updateRanks = useCallback((async (currentRanks: number[]): Promise<boolean> => {
    remainedRanks.current = null;

    try {
      await fetchWrapper("give_ranks", {
        method: "POST",
        data: { "ranks": currentRanks }
      });
    } catch(err: any) {
      addAlert({
        text: err,
        type: "danger",
      }, 15);
      return true;
    }
    
    dispatch(setClientRanks(currentRanks));
    return false;
  }), [dispatch]);

  useEffect(() => {
    let updateRanksInterval = setInterval(() => {
      if(nowRanks === savedRanks)
        return;

      updateRanks(nowRanks).then((revertNowRanks) => {
        if(revertNowRanks)
          setNowRanks(savedRanks);
      });
      
    }, 1000);

    return () => {
      clearInterval(updateRanksInterval);
    }
  }, [nowRanks, savedRanks, dispatch, updateRanks]);

  useEffect(() => {
    let animTimeout = setTimeout(() => {
      setAnimload(true);
    }, 1300);

    return () => {
      if(remainedRanks.current)
        updateRanks(remainedRanks.current);

      clearTimeout(animTimeout);
    }
  }, [updateRanks]);

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

      if(privaciesRanksId.length === 3){
        buffer = buffer.filter((val) => !(privaciesRanksId.includes(val)));
        buffer.push(doNotDisturbId);

        addAlert({
          text: `رنک Do Not Disturb همه رنک های حریم شخصی رو در بر داره پس بجای سه تا رنک بهت این رنک طلایی رو میدم، قابل نداره`,
          type: "info"
        }, 15);
      } else if(hasDnd && privaciesRanksId.includes(rankId)) {
        addAlert({
          text: `رنک Do Not Disturb همه رنک های حریم شخصی رو در بر داره پس ابتدا رنک Do Not Disturb رو از خودت بگیر`,
          type: "danger"
        }, 10);
        return;
      }

      if(rankId === doNotDisturbId && privaciesRanksId.length !== 0){
        buffer = buffer.filter((val) => !(privaciesRanksId.includes(val)));
      }


      let gameRankCount = 0;
      for(let rank of gameRanks){
        if(buffer.includes(rank.id))
          gameRankCount++;
      }

      if(gameRankCount > maxGameRanks){
        addAlert({
          text: `نمی تونی بیشتر از ${maxGameRanks} رنک بازی به خودت بدی`,
          type: "danger",
        }, 5);
        return;
      }
    }

    setNowRanks(buffer);
    remainedRanks.current = buffer;    
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