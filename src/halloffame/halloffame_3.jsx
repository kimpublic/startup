import React from 'react';
import { useNavigate } from 'react-router-dom';
import './halloffame.css';
import '../app.css';

export function Halloffame() {
  const navigate = useNavigate();

  // 현재 로그인된 유저의 통계 정보를 Local Storage에서 읽어옴 (없으면 기본값 사용)
  const currentEmail = localStorage.getItem('userEmail') || 'guest@example.com';
  const userData = JSON.parse(localStorage.getItem(currentEmail)) || { frontmanDefeats: 0, friendInvites: 0, canInvite: false };

  const [userStats, setUserStats] = React.useState({
    nickName: localStorage.getItem('nickName') || 'Guest',
    frontmanDefeats: userData.frontmanDefeats,
    friendInvites: userData.friendInvites,
  });

  // 최신 데이터 반영
  function updateStats(newStats) {
    setUserStats((prevStats) => {
      const updatedStats = {
        ...prevStats,
        frontmanDefeats: newStats.frontmanDefeats,
        friendInvites: newStats.friendInvites,
      };
  
      localStorage.setItem('frontmanDefeats', updatedStats.frontmanDefeats);
      localStorage.setItem('friendInvites', updatedStats.friendInvites);
  
      return updatedStats; // ✅ React 상태 업데이트 즉시 반영
    });
  }
  

  const [defeatScores, setDefeatScores] = React.useState([]);
  const [inviteScores, setInviteScores] = React.useState([]);

  React.useEffect(() => {
    const defeatData = JSON.parse(localStorage.getItem('defeatScores')) || [];
    const inviteData = JSON.parse(localStorage.getItem('inviteScores')) || [];
    
    setDefeatScores(defeatData);
    setInviteScores(inviteData);
  }, [userStats.frontmanDefeats, userStats.friendInvites]);

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

  // ✅ 새로운 defeat 기록 추가 함수 (10위까지만 유지)
  function updateDefeatScores(newEntry) {
    let updatedScores = [...defeatScores];
  
    const existingIndex = updatedScores.findIndex((entry) => entry.name === newEntry.name);
    if (existingIndex !== -1) {
      // ✅ 이미 랭킹에 있는 유저라면 점수 업데이트
      updatedScores[existingIndex].score += 1;
    } else {
      // ✅ 새로운 유저라면 추가
      updatedScores.push(newEntry);
    }
  
    updatedScores = updatedScores.sort((a, b) => b.score - a.score).slice(0, 10);
  
    setDefeatScores(updatedScores);
    localStorage.setItem('defeatScores', JSON.stringify(updatedScores));
  }
  
  function updateInviteScores(newEntry) {
    let updatedScores = [...inviteScores];
  
    const existingIndex = updatedScores.findIndex((entry) => entry.name === newEntry.name);
    if (existingIndex !== -1) {
      updatedScores[existingIndex].score += 1;
    } else {
      updatedScores.push(newEntry);
    }
  
    updatedScores = updatedScores.sort((a, b) => b.score - a.score).slice(0, 10);
  
    setInviteScores(updatedScores);
    localStorage.setItem('inviteScores', JSON.stringify(updatedScores));
  }
  


  return (
    <main>
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
