import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import './invite.css';

export function Invite() {
  const navigate = useNavigate();
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [canInvite, setCanInvite] = useState(false);
  const [friendInvites, setFriendInvites] = useState(0);

  // ✅ 백엔드에서 현재 유저 정보 가져오기
  async function fetchUserStats() {
    try {
      const response = await fetch('/api/user/stats');
      if (!response.ok) throw new Error('Failed to fetch user stats');
      const data = await response.json();

      setCanInvite(data.canInvite);  // ✅ 초대 가능 여부 업데이트
      setFriendInvites(data.friendInvites); // ✅ 초대 횟수 업데이트
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }

  useEffect(() => {
    fetchUserStats();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canInvite) return;

    try {
      // ✅ 초대 API 요청
      const response = await fetch('/api/scores/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to update invite count');
      const updatedData = await response.json();

      // ✅ 초대 가능 여부 업데이트 (백엔드에서 자동 처리)
      setCanInvite(updatedData.canInvite);
      setFriendInvites(updatedData.friendInvites);

      alert(`Invitation sent to ${friendName} at ${friendEmail}!`);

      // ✅ 이메일 초대 API 추가 예정 (여기에서 실행 가능)
    } catch (error) {
      console.error('Error updating invite count:', error);
    }

    setFriendName('');
    setFriendEmail('');
  };

  return (
    <main className="invite-page">
      <h1>Congratulations on Your Victory!</h1>
      <div className="text-container">
        <p>
          You have earned the privilege to invite one of your friends to this thrilling game.
          Please enter your friend's name and email address below.
          The invitation will be delivered to your friend by our agent.
        </p>
      </div>

      <br />


      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="friend-name">Friend's Name:</label>
          <input
            type="text"
            id="friend-name"
            placeholder="Enter your friend's name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="friend-email">Friend's Email:</label>
          <input
            type="email"
            id="friend-email"
            placeholder="Enter your friend's email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={!canInvite}>{canInvite ? "Send Invitation" : "Invitation Already Sent"}</button>
      </form>

      <br />

      <div className="text-container">
        <p>The number of friends who accept your invitation to this heart-pounding game will be recorded in the Hall of Fame.</p>
      </div>

      <br />

      {/* React Router로  hall of fame 페이지로 이동 */}
      <button onClick={() => navigate('/halloffame')}>
        Check the Hall of Fame
      </button>
      <br />
      {/* React Router로  플레이 페이지로 이동 */}
      <button onClick={() => navigate('/play')}>
        Play again
      </button>
      
    </main>
  );
}
