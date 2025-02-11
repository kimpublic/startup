import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import './about.css';

export function About() {
  const navigate = useNavigate();

  return (
    <main>
      <h1>
        Koreans always seem to have a knack for making things more challenging.
      </h1>

      <div className="text-container">
        Have you heard of 'Rock-Paper-Scissors, Minus One'? This is a unique twist on the traditional game, 
        rock-paper-scissors, made famous by the global Netflix hit 'Squid Game'. 
        Now, you will face off against characters from Squid Game in intense, strategic battles. 
        Victory will earn you a place in the 'Hall of Fame,' where your achievements will be remembered forever. 
        Winners also gain the exclusive privilege of inviting their friends to join this extraordinary challenge. 
        A thrilling game where a simple choice can lead to ultimate glory—dare to play now!
      </div>

      <br />

      {/* React Router를 사용하여  로그인 페이지 이동 */}
      <button onClick={() => navigate('/')}>
        Begin Your First Step Here
      </button>

      <br />
      <br />

      
      <img 
        src="/sources/aboutgif.gif" 
        alt="화이팅!" 
        style={{ width: "70%", maxWidth: "700px" }} 
      />

      <br />

      <div className="text-container">
        <div>
          This game was created as a part of Minjoong's CS 260 assignment for non-commercial purposes.
        </div>
        <br />
        <div>
          I extend my respect and gratitude to <span className="highlight">Hwang Dong-hyuk </span>for showcasing the spicy side of Koreans to the world by revealing a unique aspect of Korea 
          through <span className="highlight">'Squid Game'</span>.
        </div>
        <div>
          <span className="highlight">오징어게임</span>을 통해 세상에 한국의 색다른 면을 보여줌으로써 
          한국인의 매운맛을 보여주신 <span className="highlight">황동혁</span>님께 존경과 감사를 보냅니다.
        </div>
        <br />
        <div>
          - Game Maker, Minjoong Kim | 게임 제작자 김민중 드림
        </div>
      </div>
    </main>
  );
}
