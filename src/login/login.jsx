import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';

export function Login() {
  const navigate = useNavigate();

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // 로그인 처리 로직 추가 가능
    alert(`Logged in with Email: ${email}`);
    navigate('/how'); // 로그인 후 "How to Play" 페이지로 이동
  };

  return (
    <main>
      <h1>Player Entry</h1>

      <form onSubmit={handleSubmit}>
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
            placeholder="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div>
          <span>🧑‍💼</span>
          <input 
            type="text" 
            placeholder="referral code if you have" 
            value={referral} 
            onChange={(e) => setReferral(e.target.value)} 
          />
        </div>

        <br />

        <button type="submit" onClick={() => navigate('/how')}>
            Login
        </button>
        <button type="submit" onClick={() => navigate('/how')}>
          Create
        </button>
      </form>
    </main>
  );
}

/* 리퍼럴 코드 확인하는 로직 필요하고, 아이디 비밀번호 관련 API 추가하자. 이미 있는 계정이면 create 활성화되면 안됨. */