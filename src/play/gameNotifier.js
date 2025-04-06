// 이벤트 타입 정의
const GameEvent = {
    Defeat: 'frontmanDefeat', // 플레이어가 frontman을 이겼을 때
    Fail: 'fail',             // 실패했을 때 (패배, 시간초과 등)
    System: 'system'          // 연결 상태용
  };
  
  // 메시지 구조 클래스
  class EventMessage {
    constructor(from, type, value) {
      this.from = from;
      this.type = type;
      this.value = value;
    }
  }
  
  // WebSocket 연결 및 이벤트 핸들링
  class GameEventNotifier {
    events = [];
    handlers = [];
  
    constructor() {
      const port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
  
      this.socket.onopen = () => {
        this.receiveEvent(new EventMessage('system', GameEvent.System, { msg: 'connected' }));
      };
  
      this.socket.onclose = () => {
        this.receiveEvent(new EventMessage('system', GameEvent.System, { msg: 'disconnected' }));
      };
  
      this.socket.onmessage = async (msg) => {
        try {
          const event = JSON.parse(await msg.data.text());
          this.receiveEvent(event);
        } catch (e) {
          console.error('Invalid WebSocket message:', e);
        }
      };
    }
    
    removeHandler(handler) {
        this.handlers = this.handlers.filter((h) => h !== handler);
      }
      
  
    // 서버에 이벤트 전송
    broadcastEvent(from, type, value) {
      const event = new EventMessage(from, type, value);
      this.socket.send(JSON.stringify(event));
    }
  
    // 외부에서 이벤트 수신 처리기 등록
    addHandler(handler) {
      this.handlers.push(handler);
    }
  
    // 서버로부터 받은 메시지 처리
    receiveEvent(event) {
      this.events.push(event);
      this.handlers.forEach((handler) => handler(event));
    }
  }
  
  // 싱글 인스턴스로 내보내기
  const GameNotifier = new GameEventNotifier();
  export { GameNotifier, GameEvent };
  