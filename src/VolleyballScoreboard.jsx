import React, { useEffect, useRef, useState } from "react";
import "./VolleyballScoreboard.css";

/* Rotation helpers */
const rotateClockwise = (players) => players.map((_, i) => players[(i + 5) % 6]);
const rotateAntiClockwise = (players) => players.map((_, i) => players[(i + 1) % 6]);

function Timer({ initial = 0 }) {
  const [s, setS] = useState(initial);
  const ref = useRef(null);
  useEffect(() => () => clearInterval(ref.current), []);
  const start = () => {
    if (ref.current) return;
    ref.current = setInterval(() => setS(x => x + 1), 1000);
  };
  const pause = () => { clearInterval(ref.current); ref.current = null; };
  const reset = () => { pause(); setS(initial); };
  const fmt = (sec) => {
    const mm = Math.floor(sec / 60).toString().padStart(2, "0");
    const ss = (sec % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };
  return (
    <div className="timer-wrap">
      <div className="timer-display">{fmt(s)}</div>
      <div className="timer-actions">
        <button onClick={start}>▶</button>
        <button onClick={pause}>⏸</button>
        <button onClick={reset}>↺</button>
      </div>
    </div>
  );
}

function PlayerButton({ name, isServer, onClick, color }) {
  return (
    <div
      className={`player-btn ${isServer ? "server" : ""}`}
      onClick={onClick}
      style={{ borderColor: isServer ? color : "transparent" }}
    >
      <div className="player-text">{name}</div>
      {isServer && <div className="server-icon">🏐</div>}
    </div>
  );
}

export default function App() {
  const [homePlayers, setHomePlayers] = useState(["1","2","3","4","5","6"]);
  const [awayPlayers, setAwayPlayers] = useState(["1","2","3","4","5","6"]);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [servingTeam, setServingTeam] = useState("away");

  // --- NEW: Reset Functions ---
  
  // Reset Away (Red) Team: Score 0, Roster 1-6
  const resetAway = () => {
    setAwayScore(0);
    setAwayPlayers(["1","2","3","4","5","6"]);
  };

  // Reset Home (Blue) Team: Score 0, Roster 1-6
  const resetHome = () => {
    setHomeScore(0);
    setHomePlayers(["1","2","3","4","5","6"]);
  };

  // Set server logic
  const setServer = (team, idx) => {
    if (team === "home") {
      setHomePlayers(prev => {
        const target = prev[idx];
        let arr = [...prev];
        for (let i = 0; i < 6; i++) {
          if (arr[0] === target) break;
          arr = rotateClockwise(arr);
        }
        return arr;
      });
      setServingTeam("home");
    } else {
      setAwayPlayers(prev => {
        const target = prev[idx];
        let arr = [...prev];
        for (let i = 0; i < 6; i++) {
          if (arr[0] === target) break;
          arr = rotateClockwise(arr);
        }
        return arr;
      });
      setServingTeam("away");
    }
  };

  return (
    <div className="app">
      <header className="top-row">
        <div className="small-score left">{awayScore}</div>
        <Timer initial={0} />
        <div className="small-score right">{homeScore}</div>
      </header>

      <main className="main-grid">
        <div className="labels">
          <div className="label-left">Away Team</div>
          <div className="label-right">Home Team</div>
        </div>

        <div className="big-scores">
          {/* Away big score */}
          <div
            className="big-score red"
            onClick={() => {
              setAwayScore(s => s + 1);
              setServingTeam("away");
            }}
          >
            {awayScore}
          </div>

          {/* Home big score */}
          <div
            className="big-score blue"
            onClick={() => {
              setHomeScore(s => s + 1);
              setServingTeam("home");
            }}
          >
            {homeScore}
          </div>
        </div>
              
        {/* --- Controls Row with NEW RESET BUTTONS --- */}
        <div className="controls-row">
          <div className="control-icons" style={{ width: '100%', justifyContent: 'space-between', padding: '0 20px' }}>
            
            {/* Reset Away Button */}
            <button 
              className="icon-btn" 
              onClick={resetAway}
              style={{ 
                fontSize: '0.9rem', 
                color: '#e84b45', 
                border: '1px solid #e84b45', 
                borderRadius: '6px', 
                padding: '8px 16px',
                background: 'transparent'
              }}
            >
              ⟲ Reset Away
            </button>

            {/* Reset Home Button */}
            <button 
              className="icon-btn" 
              onClick={resetHome}
              style={{ 
                fontSize: '0.9rem', 
                color: '#2f9ef2', 
                border: '1px solid #2f9ef2', 
                borderRadius: '6px', 
                padding: '8px 16px',
                background: 'transparent'
              }}
            >
              Reset Home ⟲
            </button>

          </div>
        </div>
            
        <div className="rotate-row">
          <div className="rotate-left">
            <button onClick={() => { setAwayPlayers(p => rotateClockwise(p)); }} className="rotate-btn">⟳</button>
            <button onClick={() => { setAwayPlayers(p => rotateAntiClockwise(p)); }} className="rotate-btn">⟲</button>
          </div>
          <div className="rotate-right">
            <button onClick={() => { setHomePlayers(p => rotateClockwise(p)); }} className="rotate-btn">⟳</button>
            <button onClick={() => { setHomePlayers(p => rotateAntiClockwise(p)); }} className="rotate-btn">⟲</button>
          </div>
        </div>

        <div className="players-panel">
          <div className="team-panel red-bg">
            <div className="players-grid">
              {awayPlayers.map((p, idx) => (
                <PlayerButton
                  key={idx}
                  name={p}
                  isServer={idx === 0 && servingTeam === "away"}
                  onClick={() => setServer("away", idx)}
                  color="#e84b45"
                />
              ))}
            </div>
          </div>

          <div className="team-panel blue-bg">
            <div className="players-grid">
              {homePlayers.map((p, idx) => (
                <PlayerButton
                  key={idx}
                  name={p}
                  isServer={idx === 0 && servingTeam === "home"}
                  onClick={() => setServer("home", idx)}
                  color="#2f9ef2"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}