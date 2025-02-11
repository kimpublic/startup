import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import './play.css';

export function Play() {
  const navigate = useNavigate();

  return (
    <main>
      {/* 1. 플레이어 정보 */}
      <div className="player-info">
        Player: <span className="player-email">[Player's Email]</span>
      </div>
      

      {/* 2. 게임 상태 전광판 */}
      <div className="status-board">
        <div className="status-small">Game Status</div>
        <div className="status-large">You win! Move onto the next round!</div>
        <div className="status-small">Stage</div>
        <div className="status-medium">Game Agent O</div>
      </div>

      {/* 3. 게임 에이전트 화면 */}
      <table className="agent-table">
        <tbody>
          <tr>
            <td colSpan="2" className="agent-image-cell">
              <img src="/sources/sources/sauce/prt_1.png" alt="Game Agent" height="220" />
            </td>
          </tr>
          <tr>
            <td className="agent-left-cell">
              <button className="agent-choice left-choice">
                <img src="/sources/sources/sauce/man_l_r_2.png" alt="Left Option" height="70" />
              </button>
            </td>
            <td className="agent-right-cell">
              <button className="agent-choice right-choice">
                <img src="/sources/sources/sauce/man_r_p_2.png" alt="Right Option" height="70" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 4. 타이머 영역 */}
      <div className="timer-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="clock-icon" viewBox="0 0 16 16">
          <path d="M8 3.5a.5.5 0 0 1 .5.5v4h3a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z" />
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" />
        </svg>
        <div className="timer-bar">
          <div className="timer-progress"></div>
        </div>
      </div>

      {/* 5. 플레이어 게임판 */}
      <div className="player-board-container">
        <div className="player-board-title">Player (You):</div>
        <table className="player-board">
          <thead>
            <tr>
              <th>Left Hand</th>
              <th>Right Hand</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <button className="player-choice">
                  <img src="/sources/sources/sauce/m_l_r_2.png" alt="Rock" height="50" />
                </button>
              </td>
              <td>
                <button className="player-choice">
                  <img src="/sources/sources/sauce/m_r_r_2.png" alt="Rock" height="50" />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button className="player-choice">
                  <img src="/sources/sources/sauce/m_l_p_2.png" alt="Paper" height="50" />
                </button>
              </td>
              <td>
                <button className="player-choice">
                  <img src="/sources/sources/sauce/m_r_p_2.png" alt="Paper" height="50" />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button className="player-choice">
                  <img src="/sources/sources/sauce/m_l_s_2.png" alt="Scissors" height="50" />
                </button>
              </td>
              <td>
                <button className="player-choice">
                  <img src="/sources/sources/sauce/m_r_s_2.png" alt="Scissors" height="50" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 6. Retry 버튼 */}
      <div className="retry-area">
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>

      {/* 7. 초대장, 명예의 전당 버튼 */}
      <div className="extra-buttons">
        <button onClick={() => navigate('/invite')}>Send an invitation to friends as a winner</button>
        <button onClick={() => navigate('/halloffame')}>Check your name on the Hall of Fame</button>
      </div>
      <br />
    </main>
  );
}
