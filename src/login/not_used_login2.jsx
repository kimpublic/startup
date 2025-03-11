import React, { useState } from 'react';
import './login.css';
import '../app.css';

export function Unauthenticated({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    onLogin(email, ''); // 닉네임은 아직 없음
  };

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
          <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <span>🔒</span>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <br />

        <div className="btn-container">
          <button type="submit" onClick={() => handleLogin(false)} style={{ minWidth: '80px' }}>
            Login
          </button>
          <button type="submit" onClick={() => handleLogin(true)} style={{ minWidth: '80px' }}>
            Create
          </button>
        </div>
      </form>
    </main>
  );
}
