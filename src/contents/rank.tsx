import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clientInfo, type RootReducer } from '../redux/reducers';
import { fetchWrapper, addAlert, arrayIsEqual } from '../utils';

interface Rank {
  id: number,
  name: string,
  color: "blue" | "red" | "yellow" | "green" | "grey"
};

const gameRanks: Rank[] = [
  { id: 47, name: "Dota 2"           , color: "red"    },
  { id: 50, name: "Call Of Duty"     , color: "green"  },
  { id: 46, name: "Fortnite"         , color: "blue"   },
  { id: 41, name: "DDNet"            , color: "yellow" },
  { id: 49, name: "Minecraft"        , color: "green"  },
  { id: 51, name: "Rust"             , color: "red"    },
  { id: 52, name: "League Of Legends", color: "blue"   },
  { id: 54, name: "PUBG"             , color: "yellow" },
  { id: 44, name: "Gta V"            , color: "green"  },
  { id: 45, name: "Counter Strike"   , color: "yellow" },
  { id: 42, name: "Apex Legends"     , color: "red"    },
  { id: 48, name: "Rocket League"    , color: "blue"   },
  { id: 55, name: "Rainbow Six Siege", color: "grey"   },
  { id: 43, name: "Valorant"         , color: "red"    }
];

const privacyRanks: Rank[] = [
  { id: 35, name: "Anti Poke"     , color: "yellow" },
  { id: 36, name: "Anti Pm"       , color: "yellow" },
  { id: 37, name: "Do Not Disturb", color: "red"    },
  { id: 34, name: "Anti Move"     , color: "yellow" },
];

const MAX_GAME_RANKS = 3;
const DND_RANK_ID = 37;

const sections = [
  { id: "game", title: "بازی", ranks: gameRanks },
  { id: "privacy", title: "حریم شخصی", ranks: privacyRanks }
];

export default function Rank() {
  const savedRanks = useSelector((state: RootReducer) => state.clientInfo.ranks);
  const dispatch = useDispatch();

  const [nowRanks, setNowRanks] = useState(savedRanks);

  async function updateRanks() {
    if (!arrayIsEqual(savedRanks, nowRanks)) {
      try {
        await fetchWrapper("give_ranks", {
          method: "POST",
          data: { "ranks": nowRanks }
        });
      } catch (err: any) {
        addAlert({
          text: err,
          type: "danger",
        }, 15);
        setNowRanks(savedRanks);
        return;
      }

      dispatch(clientInfo.actions.setRanks(nowRanks));
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      updateRanks();
    }, 1000);

    return () => clearInterval(interval);
  });

  function onRankClick(rank: number) {
    let buffer = nowRanks.slice();
    if (nowRanks.includes(rank)) {
      setNowRanks(buffer.filter(val => val !== rank));
      return;
    }

    buffer.push(rank);
    const splittedRanks = {
      game: gameRanks.map(val => val.id).filter(val => buffer.includes(val)),
      // not store dnd here
      privacy: privacyRanks.map(val => val.id).filter(
        val => buffer.includes(val) && val != DND_RANK_ID
      )
    };

    if (buffer.includes(DND_RANK_ID) && splittedRanks.privacy.includes(rank)) {
      addAlert({
        text: `رنک Do Not Disturb همه رنک های حریم شخصی رو در بر داره پس ابتدا رنک Do Not Disturb رو از خودت بگیر`,
        type: "danger"
      }, 10);
      return;
    }

    if (splittedRanks.privacy.length == 3) {
      buffer.push(DND_RANK_ID);
      addAlert({
        text: `رنک Do Not Disturb همه رنک های حریم شخصی رو در بر داره پس بجای سه تا رنک بهت این رنک طلایی رو میدم، قابل نداره`,
        type: "info"
      }, 15);
    }

    // remove other privacy ranks if had dnd
    if (buffer.includes(DND_RANK_ID))
      buffer = buffer.filter(val => !splittedRanks.privacy.includes(val));

    if (splittedRanks.game.length > MAX_GAME_RANKS) {
      addAlert({
        text: `نمی تونی بیشتر از ${MAX_GAME_RANKS} رنک بازی به خودت بدی`,
        type: "danger",
      }, 5);
      return;
    }

    setNowRanks(buffer);
  }

  return (
    <div id="rank">
      {sections.map((val, index) =>
        <div key={index} id={"rank-" + val.id} className={`inner-box animate__animated animate__zoomIn ${index>0? "animate__delay-" + index + "s": ""}`}>
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
  );
}
