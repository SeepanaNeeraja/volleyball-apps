import React, { useEffect, useRef, useState } from "react";

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        background: '#333', 
        padding: '16px 32px', 
        borderRadius: '12px',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'monospace',
        letterSpacing: '4px'
      }}>{fmt(s)}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={start} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer' }}>▶</button>
        <button onClick={pause} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#FF9800', color: 'white', cursor: 'pointer' }}>⏸</button>
        <button onClick={reset} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#f44336', color: 'white', cursor: 'pointer' }}>↺</button>
      </div>
    </div>
  );
}

function PlayerButton({ name, isServer, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: color,
        border: isServer ? `4px solid ${color}` : '4px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      {name}
    </div>
  );
}

export default function App() {
  const [homePlayers, setHomePlayers] = useState(["1","2","3","4","5","6"]);
  const [awayPlayers, setAwayPlayers] = useState(["1","2","3","4","5","6"]);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [servingTeam, setServingTeam] = useState("away");
  const [lastScoringTeam, setLastScoringTeam] = useState(null);

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
    <div style={{ 
      minHeight: '100vh', 
      background: '#1a1a1a', 
      color: '#fff',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header with Timer */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        maxWidth: '800px',
        margin: '0 auto 30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem' }}>
          <span style={{ color: '#e84b45', fontWeight: 'bold' }}>{awayScore}</span>
          <span>⏱</span>
        </div>
        <Timer initial={0} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem' }}>
          <span>⏱</span>
          <span style={{ color: '#2f9ef2', fontWeight: 'bold' }}>{homeScore}</span>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Team Labels */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          padding: '0 20px'
        }}>
          <div style={{ color: '#e84b45', fontSize: '1.2rem', fontWeight: 'bold' }}>Away Team</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ 
              background: '#e84b45', 
              padding: '10px 20px', 
              borderRadius: '8px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              minWidth: '60px',
              textAlign: 'center'
            }}>{awayScore}</div>
            <div style={{ 
              background: '#2f9ef2', 
              padding: '10px 20px', 
              borderRadius: '8px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              minWidth: '60px',
              textAlign: 'center'
            }}>{homeScore}</div>
          </div>
          <div style={{ color: '#2f9ef2', fontSize: '1.2rem', fontWeight: 'bold' }}>Home Team</div>
        </div>

        {/* Big Scores */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div
            onClick={() => {
              setAwayScore(s => s + 1);
              // Only rotate if the other team (home) scored last
              if (lastScoringTeam !== "away") {
                setAwayPlayers(p => rotateClockwise(p));
              }
              setServingTeam("away");
              setLastScoringTeam("away");
            }}
            style={{
              flex: 1,
              background: '#e84b45',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8rem',
              fontWeight: 'bold',
              height: '250px',
              cursor: 'pointer',
              fontFamily: 'monospace'
            }}
          >
            {awayScore}
          </div>

          <div
            onClick={() => {
              setHomeScore(s => s + 1);
              // Only rotate if the other team (away) scored last
              if (lastScoringTeam !== "home") {
                setHomePlayers(p => rotateClockwise(p));
              }
              setServingTeam("home");
              setLastScoringTeam("home");
            }}
            style={{
              flex: 1,
              background: '#2f9ef2',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8rem',
              fontWeight: 'bold',
              height: '250px',
              cursor: 'pointer',
              fontFamily: 'monospace'
            }}
          >
            {homeScore}
          </div>
        </div>
              
        {/* Controls Row */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center',
          marginBottom: '20px',
          padding: '0 20px'
        }}>
          <button style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
          <button onClick={resetAway} style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>↶</button>
          <button style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>↷</button>
          <button style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>⟳</button>
          <button style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>📊</button>
          <button style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>📤</button>
          <button onClick={resetHome} style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>⚙</button>
        </div>
            
        {/* Rotation Controls */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1, display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button onClick={() => { setAwayPlayers(p => rotateClockwise(p)); }} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>⟳</button>
            <button onClick={() => { setAwayPlayers(p => rotateAntiClockwise(p)); }} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>⟲</button>
            <button style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#555', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>🏐</button>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#0d47a1', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>🏐</button>
            <button onClick={() => { setHomePlayers(p => rotateClockwise(p)); }} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>⟳</button>
            <button onClick={() => { setHomePlayers(p => rotateAntiClockwise(p)); }} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>⟲</button>
          </div>
        </div>

        {/* Players Panel */}
        <div style={{ 
          display: 'flex', 
          gap: '4px',
          background: '#fff',
          borderRadius: '20px',
          overflow: 'hidden',
          padding: '4px'
        }}>
          <div style={{ 
            flex: 1, 
            background: '#e84b45',
            borderRadius: '16px',
            padding: '30px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              position: 'relative'
            }}>
              {awayPlayers.map((p, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <PlayerButton
                    name={p}
                    isServer={idx === 0 && servingTeam === "away"}
                    onClick={() => setServer("away", idx)}
                    color="#e84b45"
                  />
                  {/* Ball icon at 3rd row bottom left (index 4) */}
                  {idx === 4 && servingTeam === "away" && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '-8px', 
                      left: '-8px', 
                      fontSize: '1.5rem',
                      zIndex: 10
                    }}>🏐</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            background: '#2f9ef2',
            borderRadius: '16px',
            padding: '30px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              position: 'relative'
            }}>
              {homePlayers.map((p, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <PlayerButton
                    name={p}
                    isServer={idx === 0 && servingTeam === "home"}
                    onClick={() => setServer("home", idx)}
                    color="#2f9ef2"
                  />
                  {/* Ball icon at row 1 right top (index 1) */}
                  {idx === 1 && servingTeam === "home" && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '-8px', 
                      right: '-8px', 
                      fontSize: '1.5rem',
                      zIndex: 10
                    }}>🏐</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}