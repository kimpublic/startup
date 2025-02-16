import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Authenticated({ userEmail, nickName, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome, <span style={{ color: '#FF007A' }}>{userEmail}</span>!</h2>
      <h3>Your Nickname: <span style={{ color: '#FF007A' }}>{nickName ? nickName : 'Not set'}</span></h3>
      {/* 버튼들을 나란히 배치 */}
      <div style={{ display: 'flex', gap: '1em', justifyContent: 'center' }}>
        <button onClick={() => {
          if (!nickName) {
            alert('Please set your nickname first!');
            return;
          }
          navigate('/how');
        }} style={{ minWidth: '120px' }}>
          How to Play
        </button>
        <button onClick={handleLogout} style={{ minWidth: '120px' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
