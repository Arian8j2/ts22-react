interface Rank{
  id: number,
  name: string,
  color: "blue" | "red" | "yellow" | "green" | "grey"
};

const gameRanks: Rank[] = [
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

const privacyRanks: Rank[] = [
  {id: 34, name: "Anti Poke", color: "red"},
  {id: 33, name: "Anti Private Message", color: "red"},
  {id: 92, name: "Anti Move", color: "red"}
]

function Rank(): JSX.Element{
  return (
    <div id="rank">
      <div id="rank-game" className="inner-box">
        <div className="title">بازی</div>
        <div id="rank-game-buttons">
          {gameRanks.map((val) =>
            <button key={val.id} className={`btn-outline-${val.color}`}>
              {val.name}
            </button>
          )}
        </div>
      </div>
      <div id="rank-privacy" className="inner-box">
        <div className="title">حریم شخصی</div>
      </div>
    </div>
  )
}

export default Rank;