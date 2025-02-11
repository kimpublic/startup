import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import './invite.css';

export function Invite() {
  const navigate = useNavigate();
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Invitation sent to ${friendName} at ${friendEmail}!`);
    setFriendName('');
    setFriendEmail('');
  };

  return (
    <main>
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

        <button type="submit">Send Invitation</button>
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
