import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Unauthenticated({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 실제 인증 로직(예: API 호출) 대신 Mock 처리
    onLogin(email, ''); // 처음에는 닉네임은 빈 값으로 처리
    navigate('/'); // 로그인 후 환영 페이지로 이동 (Login.jsx에서 분기 처리)
  };

  return (
    <div>
      <h2>Please Log In</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', marginTop: '1em' }}>
          <button type="submit" style={{ minWidth: '80px' }}>
            Login
          </button>
          <button type="submit" style={{ minWidth: '80px' }} onClick={() => {
            console.log('Creating account (Mock)');
          }}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
