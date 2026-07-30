import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app/routes';
import Providers from './app/providers';
import socketService from './services/socket';

function App() {
  // Establish connection to socket.io client on startup
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Providers>
        {/* Ambient Noise overlay */}
        <div className="noise-overlay" />
        
        {/* Dynamic routing layers */}
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
