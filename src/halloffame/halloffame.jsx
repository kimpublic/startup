import React from 'react';
import { useNavigate } from 'react-router-dom';
import './halloffame.css';
import '../app.css';

export function Halloffame() {
    const navigate = useNavigate();

    return (
        <main>
            <h1>"Behold thy glory in the Hall of Fame."</h1>

            <div className="table-container">
                
                <table className="ranking-table">
                    <caption>Frontman Defeat Rankings</caption>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Defeats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [
                                ['1', 'John Doe', '15'],
                                ['2', 'Jane Smith', '14'],
                                ['3', 'Hyejin Kim', '13'],
                                ['4', 'Chris Park', '12'],
                                ['5', 'David Lee', '11'],
                                ['6', 'Emma Choi', '10'],
                                ['7', 'Michael Jeong', '9'],
                                ['8', 'Olivia Kim', '8'],
                                ['9', 'Sophia Han', '7'],
                                ['10', 'William Cho', '6'],
                            ].map(
                                (
                                    [rank, player, defeats]
                                ) => (
                                    <tr key={rank}>
                                        <td>{rank}</td>
                                        <td>{player}</td>
                                        <td>{defeats}</td>
                                    </tr>    
                                )
                            )
                        }
                    </tbody>
                </table>

                <table className="ranking-table">
                    <caption>Most Friends Invited Rankings</caption>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Invites</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [
                                ['1', 'James Lee', '20'],
                                ['2', 'Sophia Kim', '18'],
                                ['3', 'Emily Park', '17'],
                                ['4', 'Daniel Choi', '16'],
                                ['5', 'Grace Han', '15'],
                                ['6', 'Lucas Jung', '14'],
                                ['7', 'Benjamin Cho', '13'],
                                ['8', 'Charlotte Kang', '12'],
                                ['9', 'Amelia Jeong', '11'],
                                ['10', 'Ethan Hwang', '10'],
                            ].map( 
                                (
                                    [rank, player, invites]) => (
                                        <tr key={rank}>
                                            <td>{rank}</td>
                                            <td>{player}</td>
                                            <td>{invites}</td>
                                        </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>

            <br />
            {/* React Router를 이용한 플레이 페이지로 이동 */}
            <button className="halloffame-btn" onClick={() => navigate('/play')}>
                Play again to reclaim the throne
            </button>
        </main>
    );
}
