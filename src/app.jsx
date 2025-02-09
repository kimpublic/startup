import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return (
        <div className='body bg-dark text-light'>
            <header>
                <br />
                <div className="logo">
                    <img src="\sources\sources/sauce/title.png" alt="Logo" width="100%" />     
                </div>
        
                
                <h2>"Sir, would you like to play a game with me?"</h2>
                <br />
                
                <nav>
                    <menu className='navvar-nav'>
                        <li className='nav-item'>
                            <a className='nav-link' href="index.html">
                                Home
                            </a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href="how.html">
                                How to Play
                            </a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href="play.html">
                                Play
                            </a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href="halloffame.html">
                                Hall of Fame
                            </a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href="about.html">
                                About
                            </a>
                        </li>
                    </menu>
                </nav>
                <br />
            </header>

            <main className='container-fluid bg-secondary text-center'>
                App components go here
            </main>

            <footer>
                <span className="text-reset">Author Name: Minjoong Kim</span>
                <a href="https://github.com/kimpublic/startup">GitHub</a>
            </footer>
        </div>
    );
}