import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Bell, BellOff } from 'lucide-react';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play_2';
import { Halloffame } from './halloffame/halloffame_3';
import { About } from './about/about';
import { How } from './how/how';
import { Invite } from './invite/invite';
import { AuthState } from './login/authState';




export default function App() {
  // Local Storage에서 이메일과 닉네임 불러오기
  const savedEmail = localStorage.getItem('userEmail') || '';
  const savedNick = localStorage.getItem('nickName') || '';
  const initialAuth = savedEmail ? AuthState.Authenticated : AuthState.Unauthenticated;

  const [authState, setAuthState] = React.useState(initialAuth);
  const [userEmail, setUserEmail] = React.useState(savedEmail);
  const [nickName, setNickName] = React.useState(savedNick);

  // 배경음악 관련 상태
  const [musicOn, setMusicOn] = React.useState(false);
  const [volume, setVolume] = React.useState(0.3);
  const audioRef = React.useRef(null);

  
  // ✅ 유저 클릭 시 음악 자동 재생 & 종 아이콘 변경
  React.useEffect(() => {
    function enableAudio() {
      if (audioRef.current) {
        audioRef.current.muted = false; // 유저 클릭 후 음소거 해제
        audioRef.current.play().catch(error => console.log('Autoplay error:', error));
        audioRef.current.play(); // 음악 자동 재생
        setMusicOn(true); // 종 아이콘도 소리 켜진 상태로 변경
        document.removeEventListener('click', enableAudio); // 이벤트 리스너 제거
      }
    }
    document.addEventListener('click', enableAudio);
    return () => document.removeEventListener('click', enableAudio);
  }, []);

  // ✅ 음악 ON/OFF 토글 기능
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !musicOn;
      audioRef.current.volume = volume;
    }
  }, [musicOn, volume]);

  function handleLogin(email, nickName) {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('nickName', nickName);
    setUserEmail(email);
    setNickName(nickName);
    setAuthState(AuthState.Authenticated);
  }

  function handleLogout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('nickName');
    setUserEmail('');
    setNickName('');
    setAuthState(AuthState.Unauthenticated);
  }

  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        {/* 배경음악 import */}
        <audio ref={audioRef} src="/bgm.mp3" loop muted />

        <header>
          <br />
          <div className="logo">
            <img src="title.png" alt="Logo" width="100%" />
          </div>

          <h2>"Sir, would you like to play a game with me?"</h2>

          <nav>
            <menu className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>

              {/* 로그인 상태인 경우에만 How, Play, Hall of Fame 메뉴 노출 */}
              {authState === AuthState.Authenticated && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="how">
                      How to Play
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="play">
                      Play
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="halloffame">
                      Hall of Fame
                    </NavLink>
                  </li>
                </>
              )}

              <li className="nav-item">
                <NavLink className="nav-link" to="about">
                  About
                </NavLink>
              </li>
            </menu>
          </nav>

          {/* 배경음악 컨트롤 (오른쪽 상단 고정) */}
          <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '8px 12px',
          borderRadius: '8px',
          zIndex: 1000,
        }}
      >
        {/* 종 아이콘 버튼 */}
        <button
          onClick={() => setMusicOn(!musicOn)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {musicOn ? (
            <Bell size={24} color="white" />
          ) : (
            <BellOff size={24} color="white" />
          )}
        </button>

        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '100px' }}
        />
        </div>


          <br />
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Login
                authState={authState}
                userEmail={userEmail}
                nickName={nickName}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/how" element={<How />} />
          <Route path="/play" element={<Play />} />
          <Route path="/halloffame" element={<Halloffame />} />
          <Route path="/about" element={<About />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer>
          <span className="text-reset">Author Name: Minjoong Kim</span>
          <a href="https://github.com/kimpublic/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}
