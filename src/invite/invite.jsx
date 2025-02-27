import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import './invite.css';

export function Invite() {
  const navigate = useNavigate();
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [canInvite, setCanInvite] = useState(false);

  useEffect(() => {
    const currentEmail = localStorage.getItem('userEmail') || 'guest@example.com';
    const userData = JSON.parse(localStorage.getItem(currentEmail)) || { frontmanDefeats: 0, friendInvites: 0, canInvite: false };

    setCanInvite(userData.canInvite);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canInvite) return;

    alert(`Invitation sent to ${friendName} at ${friendEmail}!`);

    // ✅ 초대 횟수 증가
    const currentNick = localStorage.getItem('nickName') || 'Guest';
    const currentInvites = Number(localStorage.getItem('friendInvites')) || 0;
    const newInvites = currentInvites + 1;
    localStorage.setItem('friendInvites', newInvites);

    // ✅ 초대 랭킹 업데이트
    const inviteScores = JSON.parse(localStorage.getItem('inviteScores')) || [];
    const existingIndex = inviteScores.findIndex((entry) => entry.name === currentNick);

    if (existingIndex !== -1) {
      inviteScores[existingIndex].score += 1;
    } else {
      inviteScores.push({ name: currentNick, score: 1 });
    }

    // ✅ 10위까지만 유지
    const updatedInviteScores = inviteScores.sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('inviteScores', JSON.stringify(updatedInviteScores));

    // ✅ 초대 가능 여부를 `false`로 변경
    const currentEmail = localStorage.getItem('userEmail') || 'guest@example.com';
    const userData = JSON.parse(localStorage.getItem(currentEmail)) || { frontmanDefeats: 0, friendInvites: 0, canInvite: false };

    userData.friendInvites += 1;
    userData.canInvite = false; // ✅ 초대 후 false로 변경

    localStorage.setItem(currentEmail, JSON.stringify(userData));
    setCanInvite(false);

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
