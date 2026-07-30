import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((item) => (
            <ToastItem
              key={item.id}
              {...item}
              onClose={() => removeToast(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ message, type, onClose }) => {
  const icons = {
    success: <FiCheckCircle className="h-5 w-5 text-secondary glow-text-secondary" />,
    error: <FiAlertCircle className="h-5 w-5 text-danger" />,
    warning: <FiAlertTriangle className="h-5 w-5 text-warning" />,
    info: <FiInfo className="h-5 w-5 text-primary glow-text-primary" />,
  };

  const borderColors = {
    success: 'border-secondary/20 shadow-[0_4px_20px_rgba(0,255,149,0.1)]',
    error: 'border-danger/20 shadow-[0_4px_20px_rgba(255,77,109,0.1)]',
    warning: 'border-warning/20 shadow-[0_4px_20px_rgba(255,200,87,0.1)]',
    info: 'border-primary/20 shadow-[0_4px_20px_rgba(0,229,255,0.1)]',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border bg-[#111111]/90 backdrop-blur-md text-white text-sm font-sans ${borderColors[type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="font-medium tracking-wide">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-md text-text-muted hover:text-white hover:bg-white/5 transition-all duration-200"
      >
        <FiX className="h-4 w-4" />
      </button>
    </motion.div>
  );
};
