import React, { useState } from 'react';
import './login.css';
import '../app.css';

export function Unauthenticated({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (isCreate = false) => {
    if (!email || !password) {
      alert('Please enter Email and Password!');
      return;
    }

    const endpoint = isCreate ? '/api/auth/create' : '/api/auth/login';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      onLogin(result.email, result.nickName || '');
    } else {
      setError(result.msg || 'Authentication failed.');
    }
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

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <br />

        <div className="btn-container">
          <button type="submit" style={{ minWidth: '80px' }}>
            Login
          </button>
          <button type="button" onClick={() => handleLogin(true)} style={{ minWidth: '80px' }}>
            Create
          </button>
        </div>
      </form>
    </main>
  );
}
