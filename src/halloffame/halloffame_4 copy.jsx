import React from 'react';
import { useNavigate } from 'react-router-dom';
import './halloffame.css';
import '../app.css';

export function Halloffame() {
  const navigate = useNavigate();

  const [userStats, setUserStats] = React.useState({
    nickName: 'Guest',
    frontmanDefeats: 0,
    friendInvites: 0,
  });

  const [defeatScores, setDefeatScores] = React.useState([]);
  const [inviteScores, setInviteScores] = React.useState([]);

  async function fetchHallOfFame() {
    try {
      const response = await fetch('/api/scores/defeats');
      if (!response.ok) throw new Error('Failed to fetch rankings');
      const updatedDefeatScores = await response.json();
      
      // ✅ 최신 Hall of Fame 데이터로 상태 업데이트
      setDefeatScores(updatedDefeatScores);
    } catch (error) {
      console.error('Error fetching Hall of Fame:', error);
    }
  }

  async function fetchUserStats() {
    try {
      const response = await fetch('/api/user/stats');
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
  
  
  React.useEffect(() => {
    
    fetchUserStats();
  }, []);

  // ✅ useEffect 추가 (컴포넌트 마운트 시 유저 정보 및 Hall of Fame 불러오기)
  React.useEffect(() => {
    fetchUserStats();
    fetchHallOfFame(); // 🔥 여기 추가!
  }, []);


  React.useEffect(() => {
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
    fetchScores();
  }, []);
  

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
  async function updateDefeatScores(newEntry) {
    try {
      const response = await fetch('/api/scores/defeats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
  
      if (!response.ok) throw new Error('Failed to update defeat scores');
      const updatedScores = await response.json();
      setDefeatScores(updatedScores);
    } catch (error) {
      console.error('Error updating defeat scores:', error);
    }
  }
  
  async function updateInviteScores(newEntry) {
    try {
      const response = await fetch('/api/scores/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
  
      if (!response.ok) throw new Error('Failed to update invite scores');
      const updatedScores = await response.json();
      setInviteScores(updatedScores);
    } catch (error) {
      console.error('Error updating invite scores:', error);
    }
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
