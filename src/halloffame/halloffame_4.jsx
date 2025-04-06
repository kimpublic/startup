import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './halloffame.css';
import '../app.css';
import { GameNotifier, GameEvent } from '../play/gameNotifier';



export function Halloffame() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notices, setNotices] = React.useState([]);


  const [userStats, setUserStats] = React.useState({
    nickName: 'Guest',
    frontmanDefeats: 0,
    friendInvites: 0,
  });

  
  async function fetchUserStats() {
    try {
      const response = await fetch('/api/user/stats', {
        credentials: 'include',
    });
      if (!response.ok) throw new Error('Failed to fetch user stats');
      const data = await response.json();

      setUserStats({
        nickName: data.nickName,
        frontmanDefeats: data.frontmanDefeats,
        friendInvites: data.friendInvites,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }

  const [defeatScores, setDefeatScores] = React.useState([]);
  const [inviteScores, setInviteScores] = React.useState([]);

  // 하나의 함수로 defeats + invites 둘 다 가져옴
  async function fetchScores() {
    try {
      const defeatResponse = await fetch('/api/scores/defeats');
      const inviteResponse = await fetch('/api/scores/invites');
      if (!defeatResponse.ok || !inviteResponse.ok) throw new Error('Failed to fetch rankings');

      const defeatData = await defeatResponse.json();
      const inviteData = await inviteResponse.json();
      setDefeatScores(Array.isArray(defeatData) ? defeatData : []);
      setInviteScores(Array.isArray(inviteData) ? inviteData : []);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  }

  React.useEffect(() => {
    fetchUserStats();
    fetchScores();
  }, [location]);

  const defeatRows = defeatScores.length ? (
    defeatScores.slice(0, 10).map((score, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{score.name.split('@')[0]}</td>
        <td>{score.score}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" style={{ color: 'gray', fontStyle: 'italic' }}>
        No defeats recorded yet
      </td>
    </tr>
  );
  
  const inviteRows = inviteScores.length ? (
    inviteScores.slice(0, 10).map((entry, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{entry.name.split('@')[0]}</td>
        <td>{entry.score}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" style={{ color: 'gray', fontStyle: 'italic' }}>
        No invites recorded yet
      </td>
    </tr>
  );

  React.useEffect(() => {
    function handleEvent(event) {
      if (!event || !event.type || event.from === userStats.nickName) return;
  
      if (event.type === GameEvent.Defeat) {
        const rank = event.value.rank;
        if (rank) {
          addNotice(`🎉 ${event.from} defeated the Frontman and is now ranked #${rank}!`);
        } else {
          addNotice(`🎉 ${event.from} defeated the Frontman!`);
        }
      }
  
      if (event.type === GameEvent.Fail) {
        const stageNum = event.value.stage + 1;
        const reason = event.value.reason === 'timeout' ? 'timed out ⏱️' : 'lost the match ❌';
        addNotice(`💀 ${event.from} failed at Stage ${stageNum} (${reason})`);
      }
    }
  
    GameNotifier.addHandler(handleEvent);
    return () => GameNotifier.removeHandler(handleEvent);
  }, [userStats.nickName]);

  function addNotice(msg) {
    const id = Date.now(); // 고유 ID
    setNotices(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setNotices(prev => prev.filter(n => n.id !== id));
    }, 5000); // 5초 뒤 제거
  }
  
  

  
  return (
    <main>
      {/* 알림 박스들 */}
      <div className="notifications-container">
        {notices.map((n) => (
          <div key={n.id} className="notification-box">
            {n.msg}
          </div>
        ))}
      </div>

      <h1>"Behold thy glory in the Hall of Fame."</h1>

      {/* 현재 로그인 유저의 통계 정보를 제목 아래에 표시 */}
      <div className="user-stats" style={{ margin: '1em 0', fontSize: '1.2rem' }}>
  <table style={{ margin: '0 auto' }}>
    <tbody>
      <tr>
        <td style={{ padding: '0 1em' }}>
          <span style={{ color: '#FF007A', fontWeight: 'bold' }}>
            {userStats.nickName}
          </span>
        </td>
        <td style={{ padding: '0 1em' }}>
          Frontman Defeats <span className="highlight">{userStats.frontmanDefeats}</span>
        </td>
        <td style={{ padding: '0 1em' }}>
          Friends Invited <span className="highlight">{userStats.friendInvites}</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div style={{ textAlign: 'center', margin: '1em 0' }}>
  <button onClick={fetchScores} className="halloffame-btn" style={{ fontSize: '1rem' }}>
    🔄 Update the Rankings
  </button>
</div>


      <div className="table-container">
        <table className="ranking-table">
          <caption>Frontman Defeat Rankings</caption>
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Defeats</th>
            </tr>
          </thead>
          <tbody>{defeatRows}</tbody>
        </table>

        <table className="ranking-table">
          <caption>Most Friends Invited Rankings</caption>
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Invites</th>
            </tr>
          </thead>
          <tbody>{inviteRows}</tbody>
        </table>
      </div>

      <br />
      <button className="halloffame-btn" onClick={() => navigate('/play')}>
        Play again to reclaim the throne
      </button>
    </main>
  );
}
