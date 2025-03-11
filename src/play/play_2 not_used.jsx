import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import './play.css';

const STAGE_INFO = [
  { agentName: 'Agent Donggeurami', sameProbability: 0.3, timeLimit: 5, imageSrc: 'prt_1.png' }, // 0.3 5
  { agentName: 'Agent Semo', sameProbability: 0.1, timeLimit: 4, imageSrc: 'prt_2.png' }, // 0.1 4 
  { agentName: 'Agent Nemo', sameProbability: 0.0, timeLimit: 3, imageSrc: 'prt_3.png' }, // 3
  { agentName: 'Agent Frontman', sameProbability: 0.0, timeLimit: 2, imageSrc: 'prt_5.png' },
];

const DIFFERENT_OPTIONS = [
  ['s','r'], ['r','s'],
  ['s','p'], ['p','s'],
  ['r','p'], ['p','r'],
];
const SAME_OPTIONS = [
  ['s','s'],
  ['r','r'],
  ['p','p'],
];

// 헬퍼: (side='l'|'r', choice='s'|'r'|'p') => "man_l_r_2.png"
function getHandImage(side, choice){
  if(!choice) return null;
  return `man_${side}_${choice}_2.png`;
}

export function Play() {
  const navigate = useNavigate();

  // 로그인 닉네임
  const nickName = localStorage.getItem('nickName') || '';

  // 스테이지 0~3
  const [stage, setStage] = useState(0);

  // 단계: 'ready' | 'firstPick' | 'finalPick' | 'result'
  const [phase, setPhase] = useState('ready');

  // timeLeft (ex: 5)
  const [timeLeft, setTimeLeft] = useState(STAGE_INFO[stage].timeLimit);

  // 전광판 메시지
  const [statusMessage, setStatusMessage] = useState('...');

  // 승리 페이지 관리
  const [gameOver, setGameOver] = useState(false);

  // 에이전트
  const [agentLeft, setAgentLeft] = useState(null);
  const [agentRight, setAgentRight] = useState(null);

  // 유저
  const [userLeft, setUserLeft] = useState(null);
  const [userRight, setUserRight] = useState(null);

  // 최종
  const [agentFinal, setAgentFinal] = useState(null);
  const [userFinal, setUserFinal] = useState(null);
  const [userFinalHand, setUserFinalHand] = useState(null);

  // 사운드
  // const hoverSound = useRef(new Audio('/hoverSound.mp3'));
  const clickSound = useRef(new Audio('/clickSound.mp3'));

  // 효과음 추가 
  const tickSound = useRef(new Audio('/tick.mp3'));  // 1초 감소할 때 나는 효과음
  const timeUpSound = useRef(new Audio('/timeUp2.mp3'));  // 시간이 완전히 끝났을 때 효과음

  const loseSound = useRef(new Audio('/lose.mp3')); //  패배 효과음
  const victorySound = useRef(new Audio('/victory.mp3')); //  프론트맨 격파 효과음

  


  // -------------------------------------------------------------------
  //  STAGE 초기화
  // -------------------------------------------------------------------
  useEffect(()=>{
    setPhase('ready');
    setTimeLeft(STAGE_INFO[stage].timeLimit);
    setStatusMessage('Get ready...');
    setAgentLeft(null); setAgentRight(null);
    setUserLeft(null);  setUserRight(null);
    setAgentFinal(null);setUserFinal(null);

    // 3,2,1
    let c=3;
    const cd = setInterval(()=>{
      setStatusMessage(`${c}...`);
      c--;
      if(c<0){
        clearInterval(cd);
        setPhase('firstPick');
        setTimeLeft(STAGE_INFO[stage].timeLimit);
        setStatusMessage("Pick your left & right hands!");
        createAgentOptions(stage);
      }
    },1000);
    return ()=>clearInterval(cd);
  },[stage]);

  // -------------------------------------------------------------------
  //  타이머
  // -------------------------------------------------------------------
  useEffect(()=>{
    if(phase==='ready'||phase==='result') return;
    if(timeLeft<=0){
      // 0s 표시 후에도 게이지는 width=0으로 남아있어야 함
      setTimeLeft(0);

      timeUpSound.current.play().catch(() => {});  // 시간이 다 되면 효과음 B 재생

      // 1초간 0% 게이지 보여주고 나서 handleTimeUp
      handleTimeUp();
      return;
    }
    // 1초마다 감소하는 타이머 설정
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          tickSound.current.play().catch(() => {});  // 1초 줄어들 때 효과음 A 재생
          return prev - 1;
        } else {
          return 0;  // 시간이 0이면 타이머 종료
        }
      });
    }, 1000);
    return ()=> clearInterval(timer);
  },[timeLeft,phase]);

  function handleTimeUp(){
    if(phase==='firstPick'){
      // 왼/오 다 골랐으면 finalPick
      if(!userLeft||!userRight){
        setStatusMessage("Time's up! You didn't pick both. You lose!");
        loseSound.current.play().catch(() => {});
        setPhase('result');
      } else {
        setPhase('finalPick');
        setTimeLeft(STAGE_INFO[stage].timeLimit);
        setStatusMessage("Agent's hands are revealed! Now pick your final hand!");
      }
    }
    else if(phase==='finalPick'){
      // 에이전트 최종 선택 => 유저가 final 안했으면 패배
      if(!userFinal){
        // agentFinal= auto
        const aF= decideAgentFinal(agentLeft, agentRight, userLeft, userRight);
        setAgentFinal(aF);
        setStatusMessage("Time's up! You didn't pick final. You lose!");
        loseSound.current.play().catch(() => {});
        setPhase('result');
      } else {
        finishRound();
      }
    }
  }

  // -------------------------------------------------------------------
  //  에이전트 양손 생성
  // -------------------------------------------------------------------
  function createAgentOptions(st){
    const {sameProbability} = STAGE_INFO[st];
    if(Math.random()< sameProbability){
      const pair= SAME_OPTIONS[Math.floor(Math.random()*SAME_OPTIONS.length)];
      setAgentLeft(pair[0]); setAgentRight(pair[1]);
    } else {
      const pair= DIFFERENT_OPTIONS[Math.floor(Math.random()*DIFFERENT_OPTIONS.length)];
      setAgentLeft(pair[0]); setAgentRight(pair[1]);
    }
  }

  // -------------------------------------------------------------------
  //  유저 firstPick
  // -------------------------------------------------------------------
  function pickLeft(choice){
    if(phase!=='firstPick') return;
    setUserLeft(choice);
    clickSound.current.play().catch(()=>{});
  }
  function pickRight(choice){
    if(phase!=='firstPick') return;
    setUserRight(choice);
    clickSound.current.play().catch(()=>{});
  }

  // -------------------------------------------------------------------
  //  유저 finalPick
  // -------------------------------------------------------------------
  function pickFinalLeft(){
    if(phase!=='finalPick') return;
    if(!userLeft) return;
    setUserFinal(userLeft);
    setUserFinalHand('left');
    clickSound.current.play().catch(()=>{});
  }
  function pickFinalRight(){
    if(phase!=='finalPick') return;
    if(!userRight) return;
    setUserFinal(userRight);
    setUserFinalHand('right');
    clickSound.current.play().catch(()=>{});
  }

  // -------------------------------------------------------------------
  //  finishRound => result
  // -------------------------------------------------------------------
  function finishRound() {
    const aF = decideAgentFinal(agentLeft, agentRight, userLeft, userRight);
    setAgentFinal(aF);
  
    const uF = userFinal || userLeft;
    setUserFinal(uF);

    // 🎯 승패 판별 함수 (judgeWinner)
    function judgeWinner(u, a) {
        if (!u || !a) return 'agentWin'; // 🎯 유저가 선택하지 않았으면 에이전트 승리
        if (u === a) return 'draw'; // 무승부
    
        // 🎯 가위바위보 승패 규칙 적용
        if ((u === 's' && a === 'p') || 
            (u === 'p' && a === 'r') || 
            (u === 'r' && a === 's')) {
            return 'userWin'; // 유저 승리
        }
        return 'agentWin'; // 에이전트 승리
    }
  
    const rr = judgeWinner(uF, aF);
    if (rr === 'userWin') {
      if (stage < 3) {
        setStatusMessage("You win! Next stage soon...");
        setTimeout(() => setStage(stage + 1), 1500);
      } else {
        setStatusMessage("Congratulations! You've beaten the frontman!");
        setGameOver(true);

        victorySound.current.play().catch(() => {});
        
        // ✅ 현재 로그인한 유저의 데이터 가져오기
        const currentEmail = localStorage.getItem('userEmail') || 'guest@example.com';
        const userData = JSON.parse(localStorage.getItem(currentEmail)) || { frontmanDefeats: 0, friendInvites: 0, canInvite: false };

        // ✅ frontmanDefeats 증가
        userData.frontmanDefeats += 1;

        // ✅ 개별 유저의 초대 가능 여부를 true로 변경
        userData.canInvite = true;

        // ✅ 개별 유저 데이터 저장
        localStorage.setItem(currentEmail, JSON.stringify(userData));
        


        // ✅ Hall of Fame 랭킹 업데이트
        const defeatScores = JSON.parse(localStorage.getItem('defeatScores')) || [];
        const existingIndex = defeatScores.findIndex((entry) => entry.name === nickName);

        if (existingIndex !== -1) {
          defeatScores[existingIndex].score += 1;
        } else {
          defeatScores.push({ name: nickName, score: 1 });
        }

        // ✅ 10위까지만 유지
        const updatedDefeatScores = defeatScores.sort((a, b) => b.score - a.score).slice(0, 10);
        localStorage.setItem('defeatScores', JSON.stringify(updatedDefeatScores));


      }
    } else if (rr === 'agentWin') {
      setStatusMessage("You lose! Try again!");

      loseSound.current.play().catch(() => {});
    } else {
      setStatusMessage("Draw! Restarting stage...");
      setTimeout(() => resetStage(), 1500);  // 🎯 무승부 시 현재 스테이지를 다시 세팅
    }
    setPhase('result');
  }

  function resetStage() {
    setPhase('ready');
    setTimeLeft(STAGE_INFO[stage].timeLimit);
    setStatusMessage('Get ready...');
    setAgentLeft(null);
    setAgentRight(null);
    setUserLeft(null);
    setUserRight(null);
    setAgentFinal(null);
    setUserFinal(null);
  
    let c = 3;
    const cd = setInterval(() => {
      setStatusMessage(`${c}...`);
      c--;
      if (c < 0) {
        clearInterval(cd);
        setPhase('firstPick');
        setTimeLeft(STAGE_INFO[stage].timeLimit);
        setStatusMessage("Pick your left & right hands!");
        createAgentOptions(stage);
      }
    }, 1000);
  }


  // -------------------------------------------------------------------
  //  에이전트 최종
  // -------------------------------------------------------------------

  // 🎯 doesAgentWin 함수 추가 (이기면 true, 지면 false)
    function doesAgentWin(a, u) {
        if (!a || !u) return false; // 🎯 null 체크 추가
        return (a === 's' && u === 'p') || (a === 'p' && u === 'r') || (a === 'r' && u === 's');
    }

    // 🎯 doesDraw 함수 추가 (무승부 가능 여부 판단)
    function doesDraw(a, u) {
        if (!a || !u) return false; // 🎯 null 체크 추가
        return a === u; // 같은 모양이면 무승부 가능
    }




    function decideAgentFinal(aL, aR, uL, uR) {
      if (!aL || !aR) return 'r';
  
      // 1️⃣ 에이전트가 동일한 손을 냈다면 그대로 선택
      if (aL === aR) return aL;
  
      // 2️⃣ 무조건 이길 수 있는 손 찾기
      const leftWin = doesAgentWin(aL, uL) && doesAgentWin(aL, uR);
      const rightWin = doesAgentWin(aR, uL) && doesAgentWin(aR, uR);
  
      if (leftWin) return aL;
      if (rightWin) return aR;
  
      // 3️⃣ 더 나은 무승부 선택하기
      const leftDraw = doesDraw(aL, uL) || doesDraw(aL, uR);
      const rightDraw = doesDraw(aR, uL) || doesDraw(aR, uR);
  
      if (leftDraw && rightDraw) {
          return getBetterDrawOption(aL, aR, uL, uR);
      }
  
      if (leftDraw) return aL;
      if (rightDraw) return aR;
  
      // 4️⃣ 패배할 가능성이 낮은 손 선택
      return getBetterLosingOption(aL, aR, uL, uR);
  }
  
  // 🎯 두 개의 무승부 선택지 중 더 나은 손을 결정
  function getBetterDrawOption(aL, aR, uL, uR) {
      if (doesAgentWin(aL, uL) || doesAgentWin(aL, uR)) return aL;
      if (doesAgentWin(aR, uL) || doesAgentWin(aR, uR)) return aR;
      return aL;
  }
  
  // 🎯 둘 다 패배하는 경우, 상대적으로 덜 불리한 손 선택
  function getBetterLosingOption(aL, aR, uL, uR) {
      const leftLosses = doesAgentWin(uL, aL) + doesAgentWin(uR, aL);
      const rightLosses = doesAgentWin(uL, aR) + doesAgentWin(uR, aR);
  
      if (leftLosses < rightLosses) return aL;
      if (rightLosses < leftLosses) return aR;
      return aL;
  }
  


// 🎯 무승부가 될 수 있는지 확인하는 함수
function doesDraw(a, u) {
    return a === u; // 같은 모양이면 무승부 가능
}

  // 사운드
  const hoverSoundPlay = () => {
    const hoverSound = new Audio('/hoverSound.mp3'); // 🔥 매번 새로운 Audio 객체 생성
    hoverSound.play().catch(() => {});
  };

  // 타이머 게이지
  const totalTime= STAGE_INFO[stage].timeLimit;

  useEffect(() => {
    document.documentElement.style.setProperty('--timer-duration', `${totalTime}s`);
  }, [stage]);

  let barWidth=0;
  let barColor='lime';
  if( (phase==='firstPick'|| phase==='finalPick') ) {
    // timeLeft>=0 => 게이지 표시
    barWidth=((timeLeft - 1) / totalTime)*100;
    if((timeLeft - 1) < (totalTime/2)) barColor='orange';
    if((timeLeft - 1) < (totalTime/4)) barColor='red';
  }

  // 에이전트 손은 finalPick, result에서만 공개
  const showAgent=(phase==='finalPick'|| phase==='result');

  // 에이전트 최종 => #FF007A
  let agentLeftStyle={}, agentRightStyle={};
  if (phase === 'result') {
    if (agentFinal && agentLeft === agentFinal && agentRight === agentFinal) {
        // 🎯 유저의 최종 선택(userFinal)이 왼손인지 오른손인지에 따라 테두리 적용
        if (userFinal === userLeft) {
            agentLeftStyle = { border: '3px solid #FF007A' };
        } else if (userFinal === userRight) {
            agentRightStyle = { border: '3px solid #FF007A' };
        }
    } else {
        if (agentFinal && agentLeft === agentFinal) {
            agentLeftStyle = { border: '3px solid #FF007A' };
        }
        if (agentFinal && agentRight === agentFinal) {
            agentRightStyle = { border: '3px solid #FF007A' };
        }
    }
}

  // 유저 테두리 로직
  function userStyle(which, choice){
    let base={};

    // 1) firstPick 단계에서 초록 테두리 적용
    if(which==='left' && userLeft===choice){
      base={border:'3px solid green'};
    }
    if(which==='right'&& userRight===choice){
      base={border:'3px solid green'};
    }

    // 2) finalPick 또는 result 상태에서 최종 선택에 따라 테두리 적용
    if ((phase === 'finalPick' || phase === 'result') && userFinal === choice) {
        if (which === userFinalHand) { // 🎯 선택한 손에만 적용
          base = { border: '3px solid #FF007A' };
        }
      }
    
    return base;
}


  return (

    gameOver ? (
      <main>
      <div className="victory-screen">
        <h1 className="victory-title">🏆 Victory! 🏆</h1>
        <p className="victory-message">You've defeated all agents, including the Frontman!</p>
        <div className="extra-buttons">
          <button onClick={() => navigate('/invite')}>Send an invitation to friends as a winner</button>
          <button onClick={() => navigate('/halloffame')}>Check your name on the Hall of Fame</button>
        </div>
      </div>
      
      <div className="retry-area">
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    </main>
    )
    : (
    <main>
      {/* 닉네임 */}
      <div className="player-info">
        Player: <span className="player-email">{nickName}</span>
      </div>

      {/* 전광판 */}
      <div className="status-board">
        <div className="status-small">Stage {stage+1} - {STAGE_INFO[stage].agentName}</div>
        <div className="status-large">{statusMessage}</div>
        <div className="status-small">Time Left</div>
        <div className="status-medium">
          {(timeLeft>0)? (timeLeft+' s'): '0 s'}
        </div>
      </div>

      {/* 에이전트 */}
      <table className="agent-table">
        <tbody>
          <tr>
            <td colSpan="2" className="agent-image-cell">
              <img src={STAGE_INFO[stage].imageSrc} alt="Game Agent" height="220"/>
            </td>
          </tr>
          <tr>
            <td>
              <button className="agent-choice left-choice" style={showAgent? agentLeftStyle:{}}>
                {showAgent && agentLeft? (
                  <img src={getHandImage('l', agentLeft)} alt={agentLeft} height="70"/>
                ) : '?' }
              </button>
            </td>
            <td>
              <button className="agent-choice right-choice" style={showAgent? agentRightStyle:{}}>
                {showAgent && agentRight? (
                  <img src={getHandImage('r', agentRight)} alt={agentRight} height="70"/>
                ) : '?' }
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 타이머: phase==='firstPick' or 'finalPick' => 게이지 남음 */}
      <div className="timer-container">
        <div className="timer-bar">
          <div
            className="timer-progress"
            style={{
              width: barWidth+'%',
              backgroundColor: barColor,
              transition: 'width 1s linear'
            }}
          />
        </div>
      </div>

      {/* 유저 */}
      <div className="player-board-container">
        <div className="player-board-title">Player (You):</div>
        <table className="player-board">
          <thead>
            <tr>
              <th>Left Hand</th>
              <th>Right Hand</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {/* 바위='r' */}
                <button
                  className="player-choice"
                  style={ userStyle('left','r') }
                  onMouseEnter={hoverSoundPlay}
                  onClick={()=>{
                    if(phase==='firstPick'){ pickLeft('r'); clickSound.current.play().catch(()=>{});}
                    else if(phase==='finalPick'){ pickFinalLeft(); clickSound.current.play().catch(()=>{});}
                  }}
                  disabled={ !(phase==='firstPick'||phase==='finalPick') || timeLeft <= 0 }
                >
                  <img src="m_l_r_2.png" alt="Rock" height="50"/>
                </button>
              </td>
              <td>
                <button
                  className="player-choice"
                  style={ userStyle('right','r') }
                  onMouseEnter={hoverSoundPlay}
                  onClick={()=>{
                    if(phase==='firstPick'){ pickRight('r'); clickSound.current.play().catch(()=>{});}
                    else if(phase==='finalPick'){ pickFinalRight(); clickSound.current.play().catch(()=>{});}
                  }}
                  disabled={ !(phase==='firstPick'||phase==='finalPick') || timeLeft <= 0 }
                >
                  <img src="m_r_r_2.png" alt="Rock" height="50"/>
                </button>
              </td>
            </tr>
            <tr>
              <td>
                {/* 보='p' */}
                <button
                  className="player-choice"
                  style={ userStyle('left','p') }
                  onMouseEnter={hoverSoundPlay}
                  onClick={()=>{
                    if(phase==='firstPick'){ pickLeft('p'); clickSound.current.play().catch(()=>{});}
                    else if(phase==='finalPick'){ pickFinalLeft(); clickSound.current.play().catch(()=>{});}
                  }}
                  disabled={ !(phase==='firstPick'||phase==='finalPick') || timeLeft <= 0 }
                >
                  <img src="m_l_p_2.png" alt="Paper" height="50"/>
                </button>
              </td>
              <td>
                <button
                  className="player-choice"
                  style={ userStyle('right','p') }
                  onMouseEnter={hoverSoundPlay}
                  onClick={()=>{
                    if(phase==='firstPick'){ pickRight('p'); clickSound.current.play().catch(()=>{});}
                    else if(phase==='finalPick'){ pickFinalRight(); clickSound.current.play().catch(()=>{});}
                  }}
                  disabled={ !(phase==='firstPick'||phase==='finalPick') || timeLeft <= 0 }
                >
                  <img src="m_r_p_2.png" alt="Paper" height="50"/>
                </button>
              </td>
            </tr>
            <tr>
              <td>
                {/* 가위='s' */}
                <button
                  className="player-choice"
                  style={ userStyle('left','s') }
                  onMouseEnter={hoverSoundPlay}
                  onClick={()=>{
                    if(phase==='firstPick'){ pickLeft('s'); clickSound.current.play().catch(()=>{});}
                    else if(phase==='finalPick'){ pickFinalLeft(); clickSound.current.play().catch(()=>{});}
                  }}
                  disabled={ !(phase==='firstPick'||phase==='finalPick') || timeLeft <= 0 }
                >
                  <img src="m_l_s_2.png" alt="Scissors" height="50"/>
                </button>
              </td>
              <td>
                <button
                  className="player-choice"
                  style={ userStyle('right','s') }
                  onMouseEnter={hoverSoundPlay}
                  onClick={()=>{
                    if(phase==='firstPick'){ pickRight('s'); clickSound.current.play().catch(()=>{});}
                    else if(phase==='finalPick'){ pickFinalRight(); clickSound.current.play().catch(()=>{});}
                  }}
                  disabled={ !(phase==='firstPick'||phase==='finalPick') || timeLeft <= 0 }
                >
                  <img src="m_r_s_2.png" alt="Scissors" height="50"/>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Retry etc */}
      <div className="retry-area">
        <button className="retry-button" onClick={()=>window.location.reload()}>
          Retry
        </button>
      </div>
      {/* 이거 없앨거임임 */}
      <div className="extra-buttons">
        <button onClick={()=>navigate('/invite')}>Send an invitation to friends as a winner</button>
        <button onClick={()=>navigate('/halloffame')}>Check your name on the Hall of Fame</button>
      </div>
      <br/>
    </main>
    )
  );
}
