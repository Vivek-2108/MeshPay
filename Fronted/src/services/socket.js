import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Set();
    this.simulatedInterval = null;
  }

  connect(url = 'http://localhost:5000') {
    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        autoConnect: false,
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket.io server');
        this.emitToListeners('status', { connected: true });
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket.io server');
        this.emitToListeners('status', { connected: false });
      });

      this.socket.on('activity', (data) => {
        this.emitToListeners('activity', data);
      });

      this.socket.connect();
    } catch (error) {
      console.warn('Socket connection failed, running in simulated feed mode:', error.message);
    }

    // Start generating simulated activity logs to guarantee a high-fidelity experience
    this.startSimulatedLogs();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.stopSimulatedLogs();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  emitToListeners(event, data) {
    this.listeners.forEach((callback) => callback(event, data));
  }

  startSimulatedLogs() {
    if (this.simulatedInterval) return;

    const logTemplates = [
      { type: 'info', message: 'Bluetooth Mesh: Heartbeat broadcasted successfully.' },
      { type: 'success', message: 'Device registry synchronized with local storage.' },
      { type: 'warning', message: 'Signal attenuation: Stranger-1 connection quality is at 64%.' },
      { type: 'info', message: 'Mesh Route: Recalculating path topology from Alice -> Bridge.' },
      { type: 'success', message: 'Cryptographic Engine: SHA-256 validation check passed.' },
      { type: 'info', message: 'Bridge Node: Polling queue for offline transactions...' },
      { type: 'info', message: 'Power Status: All virtual node battery levels are optimal (>85%).' },
    ];

    this.simulatedInterval = setInterval(() => {
      // 30% chance to emit a log every 6 seconds to feel natural and not spam the user
      if (Math.random() < 0.4) {
        const randomIndex = Math.floor(Math.random() * logTemplates.length);
        const log = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          ...logTemplates[randomIndex],
        };
        this.emitToListeners('activity', log);
      }
    }, 5000);
  }

  stopSimulatedLogs() {
    if (this.simulatedInterval) {
      clearInterval(this.simulatedInterval);
      this.simulatedInterval = null;
    }
  }

  // Helper to allow components to manually trigger a log (e.g. after simulation actions)
  pushCustomLog(type, message) {
    const log = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
    };
    this.emitToListeners('activity', log);
  }
}

const socketService = new SocketService();
export default socketService;
