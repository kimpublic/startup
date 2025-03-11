import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import '../app.css';

export function Authenticated({ userEmail, nickName, onLogout, onLogin }) {
  const navigate = useNavigate();
  const [tempNick, setTempNick] = useState(nickName || '');
  const [currentNickName, setCurrentNickName] = useState(nickName || '');
  const [error, setError] = useState('');
  
  // Update local state when the prop changes
  useEffect(() => {
    setCurrentNickName(nickName || '');
    setTempNick(nickName || '');
  }, [nickName]);

  const handleSaveNick = async () => {
    if (!tempNick) {
      alert('Nickname cannot be empty!');
      return;
    }

    const response = await fetch('/api/user/nickname', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickName: tempNick }),
    });

    const result = await response.json();
    if (response.ok) {
      // Update local state immediately for UI feedback
      setCurrentNickName(tempNick);
      // Also update parent component state
      onLogin(userEmail, tempNick);
    } else {
      setError(result.msg || 'Failed to update nickname.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'DELETE' });
    onLogout();
  };

  return (
    <main className="welcome-container">
      <h1>Welcome, <span style={{ color: '#FF007A' }}>{userEmail}</span>!</h1>
      {currentNickName ? (
        <h2>Your Nickname: <span style={{ color: '#FF007A' }}>{currentNickName}</span></h2>
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <br />

      <div style={{ display: 'flex', gap: '1em', justifyContent: 'center' }}>
        <button
          style={{ minWidth: '120px' }}
          onClick={() => {
            if (!currentNickName) {
              alert('Please set your nickname first!');
              return;
            }
            navigate('/how');
          }}
        >
          How to Play
        </button>
        <button style={{ minWidth: '120px' }} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </main>
  );
}
