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
  { id: 151, name: "Dota 2"           , color: "red"    },
  { id: 152, name: "Call Of Duty"     , color: "green"  },
  { id: 176, name: "Fortnite"         , color: "blue"   },
  { id: 155, name: "DDNet"            , color: "yellow" },
  { id: 153, name: "Minecraft"        , color: "green"  },
  { id: 156, name: "World Of Warcraft", color: "yellow" },
  { id: 158, name: "Rust"             , color: "red"    },
  { id: 159, name: "Zula"             , color: "grey"   },
  { id: 160, name: "League Of Legends", color: "blue"   },
  { id: 173, name: "PUBG"             , color: "yellow" },
  { id: 154, name: "Gta V"            , color: "green"  },
  { id: 195, name: "Garry's Mod"      , color: "blue"   },
  { id: 157, name: "Counter Strike"   , color: "yellow" },
  { id: 193, name: "Apex Legends"     , color: "red"    },
  { id: 194, name: "Rocket League"    , color: "blue"   },
  { id: 196, name: "Rainbow Six Siege", color: "grey"   },
  { id: 214, name: "Hyperscape"       , color: "yellow" },
  { id: 213, name: "Valorant"         , color: "red"    }
];

const privacyRanks: Rank[] = [
  { id: 142, name: "Anti Poke"     , color: "yellow" },
  { id: 141, name: "Anti Pm"       , color: "yellow" },
  { id: 215, name: "Do Not Disturb", color: "red"    },
  { id: 200, name: "Anti Move"     , color: "yellow" },
];

const MAX_GAME_RANKS = 3;
const DND_RANK_ID = 215;

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