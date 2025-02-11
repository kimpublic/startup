import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Halloffame } from './halloffame/halloffame';
import { About } from './about/about';
import { How } from './how/how';
import { Invite } from './invite/invite';



export default function App() {
    return (
        <BrowserRouter>
            <div className='body bg-dark text-light'>
                <header>
                    <br />
                    <div className="logo">
                        <img src="title.png" alt="Logo" width="100%" />     
                    </div>
            
                    
                    <h2>"Sir, would you like to play a game with me?"</h2>
                    
                    <nav>
                        <menu className='navbar-nav'>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to="/">
                                    Home
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to="how">
                                    How to Play
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to="play">
                                    Play
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to="halloffame">
                                    Hall of Fame
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to="about">
                                    About
                                </NavLink>
                            </li>
                        </menu>
                    </nav>
                    <br />
                </header>

                <Routes>
                    <Route path='/' element={<Login />} exact />
                    <Route path='/how' element={<How />} />
                    <Route path='/play' element={<Play />} />
                    <Route path='/halloffame' element={<Halloffame />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/invite' element={<Invite />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>

                <footer>
                    <span className="text-reset">Author Name: Minjoong Kim</span>
                    <a href="https://github.com/kimpublic/startup">GitHub</a>
                </footer>
            </div>
        </BrowserRouter>
    );
}


function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}