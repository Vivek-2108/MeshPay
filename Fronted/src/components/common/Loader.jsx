import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'md', text = 'Loading payment pipeline...', fullScreen = false }) => {
  const containerSizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const ringClasses = {
    sm: 'border-2',
    md: 'border-[3px]',
    lg: 'border-4',
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <div className={`relative ${containerSizes[size]} mb-4`}>
        {/* Outer Pulsing Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75" />
        
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className={`absolute inset-0 rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent ${ringClasses[size]} border-solid`}
        />
        
        {/* Inner Ring (counter-rotating) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`absolute inset-2 rounded-full border-t-secondary border-r-transparent border-b-transparent border-l-transparent ${ringClasses[size]} border-solid opacity-80`}
        />
        
        {/* Center Glow Node */}
        <div className="absolute inset-[35%] rounded-full bg-gradient-to-tr from-primary to-secondary animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.6)]" />
      </div>

      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-sm font-semibold font-grotesk tracking-widest text-primary glow-text-primary uppercase"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary/95 backdrop-blur-md">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
