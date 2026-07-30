import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { resetMeshSimulation } from '../services/mesh';
import Button from '../components/common/Button';
import { FiLock, FiSettings, FiSliders, FiTrash2, FiKey } from 'react-icons/fi';

const Settings = () => {
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleResetSimulator = async () => {
    try {
      const res = await resetMeshSimulation();
      if (res.success) {
        toast.success('Simulation database tables cleared successfully.');
      }
    } catch (error) {
      toast.error('Failed to reset simulation database.');
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <div>
        <h1 className="text-3xl font-black font-orbitron text-white">WORKSPACE CONFIGURATION</h1>
        <p className="text-sm text-text-muted mt-1 font-sans">
          Manage local RSA cryptographic key rings and simulated Bluetooth Mesh variables
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Keys & Params */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Cryptography Keys Info Card */}
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
            <h3 className="text-base font-bold font-grotesk text-white flex items-center gap-2">
              <FiKey className="text-primary" /> Cryptographic Key Ring
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase block mb-1">RSA-2048 Public Key (PEM)</label>
                <pre className="p-3 bg-[#050505] border border-white/5 rounded-xl font-mono text-[9px] text-primary overflow-x-auto leading-relaxed">
{`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0F/L6WvF9N9YlG...
z3K9aH8g1Ld3H1J4mK9Ww0c0vJzR7m9g2b3z1r0w9z8c7vB2K1Ld9F8c...
d7W8n9v1z2r0c9y8m6a5b4w3q2z1r0e9...
-----END PUBLIC KEY-----`}
                </pre>
                <span className="text-[9px] text-text-muted block mt-1">
                  *This public key is registered on the backend database to verify payment hashes signed by your wallet.
                </span>
              </div>

              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase block mb-1">Decentralized Signature Store</label>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-xs text-text-muted leading-relaxed">
                  Your RSA private key is stored inside secure local app context. It never leaves your device and is only utilized to generate signature hashes during offline transaction packaging.
                </div>
              </div>
            </div>
          </div>

          {/* Mesh Parameters settings */}
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
            <h3 className="text-base font-bold font-grotesk text-white flex items-center gap-2">
              <FiSliders className="text-accent" /> Bluetooth Mesh Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase block mb-1">Packet Time-To-Live (TTL)</label>
                <select className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary font-sans" defaultValue="6">
                  <option value="4">4 hops</option>
                  <option value="6">6 hops (Default)</option>
                  <option value="8">8 hops</option>
                  <option value="12">12 hops</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase block mb-1">BLE Advertisement Interval</label>
                <select className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary font-sans" defaultValue="3000">
                  <option value="1000">1,000 ms (Fast)</option>
                  <option value="3000">3,000 ms (Standard)</option>
                  <option value="5000">5,000 ms (Low power)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase block mb-1">Maximum Payload Size</label>
                <select className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary font-sans" defaultValue="512">
                  <option value="256">256 bytes (Legacy)</option>
                  <option value="512">512 bytes (Standard)</option>
                  <option value="1024">1,024 bytes (Extended)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase block mb-1">Routing Algorithm</label>
                <select className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary font-sans" defaultValue="gossip">
                  <option value="gossip">Directed Epidemic Gossip</option>
                  <option value="flood">Standard Flood Routing</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Danger Zone */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl border border-danger/20 p-6 space-y-4 bg-danger/[0.02]">
            <h3 className="text-base font-bold font-grotesk text-danger flex items-center gap-2">
              <FiTrash2 className="text-danger" /> Danger Zone
            </h3>

            <p className="text-xs text-text-muted leading-relaxed">
              These actions permanently alter the state of the local simulator or delete session credentials.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleResetSimulator}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold font-grotesk bg-danger/10 hover:bg-danger/20 border border-danger/25 text-danger transition-all duration-300"
              >
                Clear Node Databases
              </button>
              
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold font-grotesk bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300"
              >
                Clear Browser Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
