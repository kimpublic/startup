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
    reconnectInterval = 3000; // 재연결 시도 간격 (3초)
  
    constructor() {
      this.connect();
    }
  
    connect() {
      const port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      const url = `${protocol}://${window.location.hostname}:${port}/ws`;
  
      this.socket = new WebSocket(url);
  
      this.socket.onopen = () => {
        console.log('🟢 WebSocket connected');
        this.receiveEvent(new EventMessage('system', GameEvent.System, { msg: 'connected' }));
      };
  
      this.socket.onclose = () => {
        console.warn('🔴 WebSocket disconnected. Reconnecting...');
        this.receiveEvent(new EventMessage('system', GameEvent.System, { msg: 'disconnected' }));
        setTimeout(() => this.connect(), this.reconnectInterval);
      };
  
      this.socket.onerror = (err) => {
        console.error('⚠️ WebSocket error:', err);
      };
  
      this.socket.onmessage = async (msg) => {
        try {
          const event = JSON.parse(await msg.data.text());
          this.receiveEvent(event);
        } catch (e) {
          console.error('❌ Invalid WebSocket message:', e);
        }
      };
    }
  
    broadcastEvent(from, type, value) {
      const event = new EventMessage(from, type, value);
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(event));
      } else {
        console.warn('⛔ WebSocket is not open. Cannot send:', event);
      }
    }
  
    addHandler(handler) {
      this.handlers.push(handler);
    }
  
    removeHandler(handler) {
      this.handlers = this.handlers.filter((h) => h !== handler);
    }
  
    receiveEvent(event) {
      this.events.push(event);
      this.handlers.forEach((handler) => handler(event));
    }
  }
  
  // 싱글 인스턴스로 내보내기
  const GameNotifier = new GameEventNotifier();
  export { GameNotifier, GameEvent };
  