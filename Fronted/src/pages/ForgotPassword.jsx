import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { FiAlertTriangle } from 'react-icons/fi';

const ForgotPassword = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 mesh-grid opacity-30 z-0 pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full radial-glow-blue z-0 pointer-events-none" />
      
      <div className="noise-overlay" />

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden"
      >
        {/* Glow Line Top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

        {/* Heading */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-warning/10 to-danger/10 border border-warning/20 mb-4"
          >
            <FiAlertTriangle className="h-7 w-7 text-warning" />
          </motion.div>
          
          <h2 className="text-2xl font-black font-orbitron tracking-tight text-white mb-2">
            RECOVER KEYS
          </h2>
          <p className="text-sm text-text-muted">
            Offline Encryption & Signature Key Retrieval
          </p>
        </div>

        {/* Notice Info */}
        <div className="space-y-4 text-sm text-text-muted leading-relaxed">
          <p>
            MeshPay operates on decentralized peer-to-peer routing. Encryption keys and account credentials are saved locally.
          </p>
          <div className="p-4 rounded-xl border border-warning/10 bg-warning/5 text-xs text-warning leading-normal">
            <strong>Security Protocol:</strong> In a production mesh node setup, password resets are disabled to prevent packet spoofing and identity theft. Please check your config parameters or register a new wallet profile.
          </div>
          <p>
            If you are running in a local simulator sandbox, please register a new wallet or re-launch with default settings.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Link to="/login" className="block w-full">
            <Button variant="outline" className="w-full py-3">
              Back to Login
            </Button>
          </Link>
          <Link to="/signup" className="block w-full">
            <Button variant="ghost" className="w-full text-xs text-text-muted hover:text-white">
              Create New Wallet Instead
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
