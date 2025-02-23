import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';
import './play.css';

const STAGE_INFO = [
  { agentName: 'Agent O', sameProbability: 0.3, timeLimit: 5 },
  { agentName: 'Agent 세모', sameProbability: 0.1, timeLimit: 4 },
  { agentName: 'Agent 네모', sameProbability: 0.0, timeLimit: 3 },
  { agentName: 'Agent 프론트맨', sameProbability: 0.0, timeLimit: 2 },
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
  const hoverSound = useRef(new Audio('/hoverSound.mp3'));
  const clickSound = useRef(new Audio('/clickSound.mp3'));

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

      // 1초간 0% 게이지 보여주고 나서 handleTimeUp
      handleTimeUp();
      return;
    }
    const timer = setInterval(()=>{
      setTimeLeft(prev=> prev-1);
    },1000);
    return ()=> clearInterval(timer);
  },[timeLeft,phase]);

  function handleTimeUp(){
    if(phase==='firstPick'){
      // 왼/오 다 골랐으면 finalPick
      if(!userLeft||!userRight){
        setStatusMessage("Time's up! You didn't pick both. You lose!");
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
      }
    } else if (rr === 'agentWin') {
      setStatusMessage("You lose! Try again!");
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




  function decideAgentFinal(aL,aR,uL,uR){
    if (!aL || !aR) return 'r'; // 🎯 안전 체크: 값이 없으면 기본값 리턴

    // 1️⃣ 에이전트가 동일한 손을 냈다면 그대로 선택
    if (aL === aR) return aL;

    // 2️⃣ 무조건 이길 수 있는 손 찾기
    const leftWin = doesAgentWin(aL, uL) && doesAgentWin(aL, uR);
    const rightWin = doesAgentWin(aR, uL) && doesAgentWin(aR, uR);

    if (leftWin) return aL;  // 왼손이 무조건 이기면 왼손 선택
    if (rightWin) return aR; // 오른손이 무조건 이기면 오른손 선택

    // 3️⃣ 무승부를 만들 수 있는 손 찾기 (유저 손 중 하나와 같으면 선택)
    if (aL === uL || aL === uR) return aL; // 왼손이 유저 손과 같으면 선택
    if (aR === uL || aR === uR) return aR; // 오른손이 유저 손과 같으면 선택

    // 4️⃣ 무승부를 만들 수 있는 추가 경우 찾기
    // 예제) 유저: `s, p` (가위, 보)  에이전트: `r, s` (주먹, 가위) => `s` 선택하면 `s` vs `s` 무승부 가능
    if (doesDraw(aL, uL) || doesDraw(aL, uR)) return aL;
    if (doesDraw(aR, uL) || doesDraw(aR, uR)) return aR;

    // 5️⃣ 이길 수도 없고, 무승부도 불가능하면 랜덤 선택
    return Math.random() < 0.5 ? aL : aR;
}

// 🎯 무승부가 될 수 있는지 확인하는 함수
function doesDraw(a, u) {
    return a === u; // 같은 모양이면 무승부 가능
}

  // 사운드
  const hoverSoundPlay=()=> {
    // hoverSound.current.play().catch(()=>{});
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
              <img src="prt_1.png" alt="Game Agent" height="220"/>
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
      <div className="extra-buttons">
        <button onClick={()=>navigate('/invite')}>Send an invitation to friends as a winner</button>
        <button onClick={()=>navigate('/halloffame')}>Check your name on the Hall of Fame</button>
      </div>
      <br/>
    </main>
  );
}
