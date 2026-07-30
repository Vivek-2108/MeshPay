import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-background-primary">
      <div className="absolute inset-0 mesh-grid opacity-20 z-0 pointer-events-none" />
      <div className="noise-overlay" />

      <div className="relative text-center z-10 max-w-md">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            textShadow: [
              '0 0 10px rgba(255, 77, 109, 0.4)',
              '0 0 25px rgba(255, 77, 109, 0.8)',
              '0 0 10px rgba(255, 77, 109, 0.4)'
            ]
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-8xl font-black font-orbitron tracking-tight text-danger mb-4"
        >
          404
        </motion.div>

        <h1 className="text-xl font-bold font-grotesk text-white mb-2 uppercase tracking-widest">
          Routing Hop Failed
        </h1>
        
        <p className="text-sm text-text-muted mb-8 leading-relaxed">
          The packet did not reach its destination. The requested URL could not be resolved within the Mesh Network.
        </p>

        <div className="bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-xl p-4 mb-8 text-left font-mono text-xs text-text-muted">
          <p className="text-danger">&gt; trace route 127.0.0.1/path</p>
          <p className="text-warning">&gt; [relay] hop-01: stranger-1 (online)</p>
          <p className="text-warning">&gt; [relay] hop-02: stranger-2 (online)</p>
          <p className="text-danger">&gt; [error] hop-03: packet TTL expired</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="px-6 py-2.5">
              Portal Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="primary" className="px-6 py-2.5">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
