import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import '../app.css';


export function Authenticated({ userEmail, nickName, onLogout, onLogin }) {
  const navigate = useNavigate();
  const [tempNick, setTempNick] = useState(nickName || '');

  const handleSaveNick = () => {
    if (!tempNick) {
      alert('Nickname cannot be empty!');
      return;
    }
    onLogin(userEmail, tempNick);
  };

  return (
    <main className="welcome-container">
      <h1>Welcome, <span style={{ color: '#FF007A' }}>{userEmail}</span>!</h1>
      {nickName ? (
        <h2>Your Nickname: <span style={{ color: '#FF007A' }}>{nickName}</span></h2>
      ) : (
        <div>
          <p>Please set your nickname before proceeding!</p>
        </div>
      )}

      <div className="input-row" style={{ maxWidth: '500px' }}>
        <span>🧑‍💼</span>
        <input type="text" value={tempNick} onChange={(e) => setTempNick(e.target.value)} placeholder="Nickname" />
        <button onClick={handleSaveNick}>Save Nickname</button>
      </div>

      <br />

      <div style={{ display: 'flex', gap: '1em', justifyContent: 'center' }}>
        <button
          style={{ minWidth: '120px' }}
          onClick={() => {
            if (!nickName && !tempNick) {
              alert('Please set your nickname first!');
              return;
            }
            navigate('/how');
          }}
        >
          How to Play
        </button>
        <button style={{ minWidth: '120px' }} onClick={onLogout}>
          Logout
        </button>
      </div>
    </main>
  );
}

