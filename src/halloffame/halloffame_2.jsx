import React from 'react';
import { useNavigate } from 'react-router-dom';
import './halloffame.css';
import '../app.css';

export function Halloffame() {
  const navigate = useNavigate();

  // 현재 로그인된 유저의 통계 정보를 Local Storage에서 읽어옴 (없으면 기본값 사용)
  const [userStats, setUserStats] = React.useState({
    nickName: localStorage.getItem('nickName') || 'Guest',
    frontmanDefeats: Number(localStorage.getItem('frontmanDefeats')) || 0,
    friendInvites: Number(localStorage.getItem('friendInvites')) || 0,
  });

  // Frontman Defeat Rankings 데이터를 Local Storage에서 가져옴
  const [defeatScores, setDefeatScores] = React.useState([]);
  React.useEffect(() => {
    const data = localStorage.getItem('defeatScores');
    if (data) {
      setDefeatScores(JSON.parse(data));
    }
  }, []);

  // Most Friends Invited Rankings 데이터를 Local Storage에서 가져옴
  const [inviteScores, setInviteScores] = React.useState([]);
  React.useEffect(() => {
    const data = localStorage.getItem('inviteScores');
    if (data) {
      setInviteScores(JSON.parse(data));
    }
  }, []);

  // Frontman Defeat Rankings 테이블 렌더링
  const defeatRows = [];
  if (defeatScores.length) {
    defeatScores.forEach((score, index) => {
      defeatRows.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{score.name.split('@')[0]}</td>
          <td>{score.score}</td>
        </tr>
      );
    });
  } else {
    defeatRows.push(
      <tr key="0">
        <td colSpan="3">No defeats recorded yet</td>
      </tr>
    );
  }

  // Most Friends Invited Rankings 테이블 렌더링
  const inviteRows = [];
  if (inviteScores.length) {
    inviteScores.forEach((entry, index) => {
      inviteRows.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{entry.name.split('@')[0]}</td>
          <td>{entry.score}</td>
        </tr>
      );
    });
  } else {
    inviteRows.push(
      <tr key="0">
        <td colSpan="3">No invites recorded yet</td>
      </tr>
    );
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
