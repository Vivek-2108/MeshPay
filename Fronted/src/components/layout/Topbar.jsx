import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiBell, FiMenu, FiRadio, FiCheck } from 'react-icons/fi';
import socketService from '../../services/socket';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar = ({ onToggleSidebar }) => {
  const { user, account, accountLoading, refreshAccount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Subscribe to socket/activity events for notifications
  useEffect(() => {
    const unsubscribe = socketService.subscribe((event, data) => {
      if (event === 'activity') {
        setNotifications((prev) => [
          {
            id: data.id,
            message: data.message,
            type: data.type,
            time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: true,
          },
          ...prev.slice(0, 4), // Keep last 5 notifications
        ]);

        // When a settlement completes, trigger balance refresh!
        if (data.message.toLowerCase().includes('settled') || data.message.toLowerCase().includes('settlement')) {
          refreshAccount();
        }
      }
    });

    return () => unsubscribe();
  }, [refreshAccount]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const hasUnread = notifications.some((n) => n.unread);

  return (
    <header className="h-20 bg-background-primary/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 fixed top-0 right-0 left-0 lg:left-64 z-20">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 text-text-muted hover:text-white rounded-lg hover:bg-white/5 transition-all"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* Network Health Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-secondary/15 bg-secondary/5 text-xs text-secondary font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="hidden sm:inline">Mesh simulator: </span>
          <span>ONLINE</span>
        </div>
        
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 text-xs text-primary font-mono">
          <FiRadio className="h-3.5 w-3.5 animate-pulse" />
          <span>Nodes: 5 (active)</span>
        </div>
      </div>

      {/* User Actions / Balance */}
      <div className="flex items-center gap-6">
        {/* Wallet Balance Display */}
        {account && (
          <div className="text-right hidden sm:block border-r border-white/5 pr-6">
            <span className="text-[10px] text-text-muted uppercase tracking-widest block font-sans">
              Wallet Balance
            </span>
            <span className={`font-mono text-base font-bold text-secondary glow-text-secondary ${accountLoading ? 'animate-pulse' : ''}`}>
              {account.balance?.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </span>
          </div>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 hover:text-primary transition-all duration-300 relative"
          >
            <FiBell className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full glow-border-primary" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop Click Shield */}
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 glass-card rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-20"
                >
                  <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-[#111111]/30">
                    <span className="text-sm font-bold font-grotesk text-white">System Feed</span>
                    {hasUnread && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] text-primary hover:underline flex items-center gap-1 font-grotesk"
                      >
                        <FiCheck className="h-3 w-3" /> Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-5 py-6 text-center text-xs text-text-muted">
                        No recent system events.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-5 py-3.5 text-left transition-all duration-200 ${
                            notif.unread ? 'bg-white/5' : 'bg-transparent'
                          }`}
                        >
                          <p className="text-xs text-white leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-text-muted block mt-1">{notif.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar Node */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent border border-white/15 flex items-center justify-center font-grotesk font-black text-sm uppercase text-background-primary">
              {user.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-semibold text-white block">{user.name}</span>
              <span className="text-[10px] text-text-muted font-mono block">{user.vpa}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
