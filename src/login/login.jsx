import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import { AuthState } from './authState';
import './login.css';

export function Login({ authState, userEmail, nickName, onLogin, onLogout }) {
  const navigate = useNavigate();

  // 로그인 폼 상태
  const [email, setEmail] = useState(userEmail || '');
  const [password, setPassword] = useState('');
  const [tempNick, setTempNick] = useState(nickName || '');

  // 로그인 또는 계정 생성 처리 (Mock)
  const handleLogin = (isCreate = false) => {
    if (!email || !password) {
      alert('Please enter Email and Password!');
      return;
    }
    if (isCreate) {
      console.log('Creating new account (Mock)');
    } else {
      console.log('Logging in (Mock)');
    }
    // 로그인 성공 시 Local Storage에 저장하고 상태 업데이트
    onLogin(email, tempNick);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleNickChange = (e) => {
    setTempNick(e.target.value);
  };

  const handleSaveNick = () => {
    if (!tempNick) {
      alert('Nickname cannot be empty!');
      return;
    }
    onLogin(email, tempNick);
  };

  // 이미 로그인된 상태 (Welcome 화면)
  if (authState === AuthState.Authenticated && email) {
    return (
      <main className="welcome-container">
        <h1>Welcome, <span style={{ color: '#FF007A' }}>{email}</span>!</h1>
        {nickName ? (
          <h2>Your Nickname: <span style={{ color: '#FF007A' }}>{nickName}</span></h2>
        ) : (
          <div>
            <p>Please set your nickname before proceeding!</p>
          </div>
        )}

        {/* 닉네임 글자수 제한 기능과 비속어 검사해야함함 */}
        <div className="input-row" style={{ maxWidth: '500px' }}>
          <span>👤</span>
          <input
            type="text"
            value={tempNick}
            onChange={handleNickChange}
            placeholder="Nickname"
          />
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
          <button style={{ minWidth: '120px' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </main>
    );
  }

  // 로그인되지 않은 상태
  return (
    <main>
      <h1>Player Entry</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(false);
        }}
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <div>
          <span>✉️</span>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <span>🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        {/* 로그인 및 Create 버튼 (같은 크기로) */}
        <div className="btn-container">
          <button
            type="submit"
            onClick={() => handleLogin(false)}
            style={{ minWidth: '80px' }}
          >
            Login
          </button>
          <button
            type="submit"
            onClick={() => handleLogin(true)}
            style={{ minWidth: '80px' }}
          >
            Create
          </button>
        </div>
      </form>
    </main>
  );
}
