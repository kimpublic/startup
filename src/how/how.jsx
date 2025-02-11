import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import './how.css';

export function How() {
    const navigate = useNavigate();

    return (
        <main>
            <h1>You're going to play a game now.</h1>

            <iframe 
                width="100%" 
                height="auto" 
                style={{ aspectRatio: "16/9", maxWidth: "600px" }}
                src="https://www.youtube.com/embed/Q4auMJndpuI" 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>

            <br />
            <br />

            <p>In this game, you will take turns playing Rock-Paper-Scissors against game agents.</p>
            <p>I trust you know the rules, however, we will add some additional rules.</p>

            <h2>Additional Rules</h2>
            <ul>
                <li>You <span className="highlight">must</span> select one of rock, paper, and scissors for your left hand and another for your right hand <span className="highlight">within the given time limit.</span></li>
                <li>Your opponent will also select two options simultaneously, one for their left hand and one for their right hand.</li>
                <li>Once both players make their selections, the choices will be revealed to each other at the same time.</li>
                <li>Each player <span className="highlight">must</span> then decide which one of their two hands (left or right) they want to use for the final showdown. <span className="highlight">Make your final decision within the time limit.</span></li>
                <li>The winner is determined based on the final choices of both players.</li>
                <li>If you win, you will proceed to play against the next agent in the sequence.</li>
            </ul>

            <h2>Tips for Winning</h2>
            <ul>
                <li>Think about your opponent’s potential choices and counter them strategically.</li>
                <li>As the game progresses, the agents will become <span className="highlight">smarter</span>, and the time limit will become <span className="highlight">shorter</span>. Stay focused!</li>
            </ul>

            <h2>Hall of Fame</h2>
            <p>The number of times you complete all rounds will be recorded in the Hall of Fame.</p>

            <br />

            <button className="how-btn" onClick={() => navigate('/play')}>
                Are you ready? Play now!
            </button>
        </main>
    );
}
