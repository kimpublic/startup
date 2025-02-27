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
  
    // ✅ 기존 닉네임 가져오기
    const oldNick = localStorage.getItem('nickName') || '';
  
    // ✅ 닉네임 변경 후 localStorage에 저장
    localStorage.setItem('nickName', tempNick);
    onLogin(userEmail, tempNick);
  
    // ✅ Hall of Fame 데이터에서 닉네임 변경 반영
    updateHallOfFameNickname(oldNick, tempNick);
  };
  
  // ✅ Hall of Fame 데이터에서 닉네임 변경 함수
  const updateHallOfFameNickname = (oldNick, newNick) => {
    if (!oldNick || oldNick === newNick) return; // 닉네임이 동일하면 변경 안 함
  
    // ✅ defeatScores 업데이트
    let defeatScores = JSON.parse(localStorage.getItem('defeatScores')) || [];
    defeatScores = defeatScores.map(entry =>
      entry.name === oldNick ? { ...entry, name: newNick } : entry
    );
    localStorage.setItem('defeatScores', JSON.stringify(defeatScores));
  
    // ✅ inviteScores 업데이트
    let inviteScores = JSON.parse(localStorage.getItem('inviteScores')) || [];
    inviteScores = inviteScores.map(entry =>
      entry.name === oldNick ? { ...entry, name: newNick } : entry
    );
    localStorage.setItem('inviteScores', JSON.stringify(inviteScores));
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

