import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiCpu } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Branding Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center border border-white/10">
              <FiCpu className="h-4 w-4 text-background-primary" />
            </div>
            <span className="font-orbitron font-black text-lg tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              MESHPAY
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Secure offline UPI digital payments using Bluetooth Mesh routing. Bypassing internet blockages one hop at a time.
          </p>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="font-grotesk font-bold text-sm text-white mb-4 uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-xs text-text-muted">
            <li>
              <a href="#docs" className="hover:text-primary hover:glow-text-primary transition-colors">Documentation</a>
            </li>
            <li>
              <a href="#api" className="hover:text-primary hover:glow-text-primary transition-colors">API References</a>
            </li>
            <li>
              <a href="#network" className="hover:text-primary hover:glow-text-primary transition-colors">Mesh Specs</a>
            </li>
            <li>
              <Link to="/simulator" className="hover:text-primary hover:glow-text-primary transition-colors">Network Simulator</Link>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="font-grotesk font-bold text-sm text-white mb-4 uppercase tracking-wider">System</h4>
          <ul className="space-y-2 text-xs text-text-muted">
            <li>
              <a href="#privacy" className="hover:text-primary hover:glow-text-primary transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms" className="hover:text-primary hover:glow-text-primary transition-colors">Terms of Service</a>
            </li>
            <li>
              <span className="text-secondary font-mono">v1.0.0 (Beta)</span>
            </li>
            <li>
              <span className="text-text-muted">Status: </span>
              <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Operational
              </span>
            </li>
          </ul>
        </div>

        {/* Contact/Social Column */}
        <div className="space-y-4">
          <h4 className="font-grotesk font-bold text-sm text-white mb-4 uppercase tracking-wider">Connect</h4>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/10 text-text-muted hover:text-primary transition-all duration-300"
            >
              <FiGithub className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/10 text-text-muted hover:text-primary transition-all duration-300"
            >
              <FiLinkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:contact@meshpay.network"
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/10 text-text-muted hover:text-primary transition-all duration-300"
            >
              <FiMail className="h-4 w-4" />
            </a>
          </div>
          <p className="text-[10px] text-text-muted">
            MeshPay is a concept product built for decentralized digital networks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} MeshPay Network. All rights reserved.
        </p>
        <p className="text-[10px] text-text-muted font-mono">
          Decentralized. Secure. Peer-to-Peer.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
