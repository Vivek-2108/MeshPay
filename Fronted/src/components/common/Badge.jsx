import React from 'react';

const Badge = ({ children, status = 'info', className = '' }) => {
  const styles = {
    // Basic states
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-primary/10 text-primary border-primary/20',
    
    // Custom mesh simulation states
    online: 'bg-secondary/10 text-secondary border-secondary/20 shadow-[0_0_8px_rgba(0,255,149,0.1)]',
    offline: 'bg-white/5 text-text-muted border-white/10',
    settled: 'bg-secondary/15 text-secondary border-secondary/30 shadow-[0_0_10px_rgba(0,255,149,0.15)]',
    failed: 'bg-danger/15 text-danger border-danger/30 shadow-[0_0_10px_rgba(255,77,109,0.15)]',
    relayed: 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_10px_rgba(108,99,255,0.15)]',
    queued: 'bg-warning/15 text-warning border-warning/30 shadow-[0_0_10px_rgba(255,200,87,0.15)]',
    
    // Cryptography states
    encrypted: 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_10px_rgba(0,229,255,0.15)]',
    signed: 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_10px_rgba(108,99,255,0.15)]',
  };

  const getPulseEffect = () => {
    if (status === 'online' || status === 'settled') {
      return 'after:absolute after:w-1.5 after:h-1.5 after:bg-current after:rounded-full after:animate-ping after:-top-0.5 after:-right-0.5';
    }
    return '';
  };

  return (
    <span className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-grotesk border ${styles[status] || styles.info} ${getPulseEffect()} ${className}`}>
      {status === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />}
      {status === 'offline' && <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />}
      {status === 'settled' && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
      {status === 'failed' && <span className="w-1.5 h-1.5 rounded-full bg-danger" />}
      {children}
    </span>
  );
};

export default Badge;
