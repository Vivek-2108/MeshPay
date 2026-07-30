import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { useDemo } from '../context/DemoContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  sendPacket,
  runGossip,
  flushPackets,
  resetMeshSimulation,
  getMeshDevices,
  toggleDeviceStatus,
  ingestPackets,
} from '../services/mesh';
import socketService from '../services/socket';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import {
  FiPlay,
  FiShuffle,
  FiRotateCcw,
  FiCpu,
  FiAlertTriangle,
  FiCheckCircle,
  FiShield,
  FiTerminal,
  FiDatabase,
  FiUsers,
  FiDollarSign,
  FiBox,
  FiGlobe,
  FiInfo,
  FiLayers,
  FiBattery,
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

const Simulator = () => {
  const { user, refreshAccount } = useAuth();
  const toast = useToast();
  const { demoMode, currentStep, setCurrentStep, nextStep, prevStep } = useDemo();
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'users';

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [amount, setAmount] = useState('500');
  const [sender, setSender] = useState('phone-alice');
  const [receiver, setReceiver] = useState('phone-bob');
  
  // Simulation Flow States
  const [currentPacket, setCurrentPacket] = useState(null);
  const [isGossiping, setIsGossiping] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [isTampered, setIsTampered] = useState(false);

  const tabs = [
    { id: 'users', label: 'Users & Nodes', icon: FiUsers, desc: 'Manage virtual devices' },
    { id: 'payments', label: 'Offline Payments', icon: FiDollarSign, desc: 'Create signed packets' },
    { id: 'packets', label: 'Packets & Security', icon: FiBox, desc: 'Inspect cipher envelopes' },
    { id: 'network', label: 'Mesh Topology', icon: FiGlobe, desc: 'Monitor active propagation' },
  ];

  const handleTabChange = (tabId) => {
    navigate(`/simulator?tab=${tabId}`);
  };

  // Enrich devices with telemetry data
  const enrichDevice = (dev) => {
    const defaults = {
      'phone-alice': { role: 'Sender Node', battery: 94, signal: '95%', connection: 'Bluetooth P2P', desc: 'Alice\'s offline mobile phone' },
      'phone-bob': { role: 'Receiver Node', battery: 89, signal: '92%', connection: 'Bluetooth P2P', desc: 'Bob\'s offline mobile phone' },
      'stranger-1': { role: 'Relay Node', battery: 67, signal: '70%', connection: 'BLE Mesh Grid', desc: 'Intermediate device passing packets' },
      'stranger-2': { role: 'Relay Node', battery: 52, signal: '64%', connection: 'BLE Mesh Grid', desc: 'Intermediate device passing packets' },
      'bridge-node': { role: 'Internet Gateway', battery: 99, signal: '88%', connection: 'Bridge BLE + 4G/WiFi', desc: 'Gateway node with internet backhaul' },
    };
    return {
      ...dev,
      ...(defaults[dev.deviceId] || { role: 'Relay Node', battery: 75, signal: '80%', connection: 'BLE Mesh Grid', desc: 'Virtual network repeater' }),
    };
  };

  // Load devices and registry from backend
  const fetchRegistry = async () => {
    try {
      const data = await getMeshDevices();
      if (data.success) {
        setDevices(data.devices || []);
      }
    } catch (error) {
      addConsoleLog('error', `Failed to contact node registry: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
    addConsoleLog('info', 'Mesh simulator initialized. Device routes scanned.');
  }, []);

  const addConsoleLog = (type, message) => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setConsoleLogs((prev) => [newLog, ...prev.slice(0, 24)]);
    socketService.pushCustomLog(type, message);
  };

  // Toggle node power state
  const handleToggleNode = async (deviceId) => {
    try {
      const res = await toggleDeviceStatus(deviceId);
      if (res.success) {
        const statusText = res.isOnline ? 'online' : 'offline';
        toast.success(`Node "${deviceId}" is now ${statusText}`);
        addConsoleLog('warning', `Topology updated: ${deviceId} set to ${statusText.toUpperCase()}`);
        fetchRegistry();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to toggle device');
    }
  };

  // 1. Send / Create Packet Offline
  const handleCreatePacket = async (e) => {
    if (e) e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.warning('Please specify a positive payment amount.');
      return;
    }
    
    const senderVpa = sender === 'phone-alice' ? 'alice@upimesh' : 'bob@upimesh';
    const receiverVpa = receiver === 'phone-alice' ? 'alice@upimesh' : 'bob@upimesh';

    addConsoleLog('info', `Generating offline transaction packet: ${senderVpa} -> ${receiverVpa} (${amount} INR)...`);

    try {
      const data = await sendPacket(sender, senderVpa, receiverVpa, Number(amount));
      if (data.success) {
        setCurrentPacket(data.packet);
        setIsTampered(false);
        toast.success('Offline Cryptographic Packet Generated!');
        addConsoleLog('success', `Packet signed locally. SHA-256: ${data.packet.packetHash.substring(0, 20)}...`);
        addConsoleLog('info', 'Encrypted Payload generated. Waiting for Bluetooth Gossip round broadcast.');
        
        if (demoMode && currentStep === 2) {
          setCurrentStep(3); // Auto move to Gossip step
        }
        handleTabChange('network'); // Redirect to network to watch gossip
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Packet creation failed');
      addConsoleLog('error', `Packet signature failed: ${error.message}`);
    }
  };

  // 2. Gossip Routing Step
  const handleGossipStep = async () => {
    if (!currentPacket) {
      toast.warning('Create a transaction packet first before running gossip routing.');
      return;
    }
    setIsGossiping(true);
    addConsoleLog('info', 'Triggering Bluetooth Low Energy Gossip Round. Exchanging local database packets...');

    try {
      const data = await runGossip();
      if (data.success) {
        if (data.logs && data.logs.length > 0) {
          data.logs.forEach((log) => {
            addConsoleLog('info', `[Gossip Hop] ${log}`);
          });
        }
        toast.success('Gossip propagation complete.');
        addConsoleLog('success', 'Gossip routing iteration resolved. Packets distributed across nearest peers.');
        
        if (demoMode && currentStep === 3) {
          setCurrentStep(4); // Move to settlement step
        }
      }
    } catch (error) {
      toast.error(error.message || 'Gossip round failed');
      addConsoleLog('error', `Gossip protocol failed: ${error.message}`);
    } finally {
      setIsGossiping(false);
    }
  };

  // 3. Clear/Settle Queue at Bridge Node
  const handleSettlePayments = async () => {
    setIsSettling(true);
    addConsoleLog('info', 'Bridge Node contacting backend server. Ingesting and decrypting packet queue...');
    
    try {
      let response;
      if (isTampered && currentPacket) {
        const bodyPacket = { ...currentPacket };
        bodyPacket.ciphertext = 'CORRUPTED_CIPHERTEXT_SIGNATURE_TAMPERED';
        bodyPacket.packetHash = '0000000000000000000000000000000000000000000000000000000000000000';
        response = await ingestPackets([bodyPacket]);
      } else {
        response = await flushPackets();
      }

      if (response.success || response.results) {
        const results = response.results || [];
        const succeeded = results.filter(r => r.status === 'settled');
        const failed = results.filter(r => r.status === 'failed');

        if (succeeded.length > 0) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
          toast.success(`Settlement complete! ${succeeded.length} transaction cleared.`);
          addConsoleLog('success', `Bank Clearing: Settled transaction ${succeeded[0].txnId}. Ledger balance updated.`);
          refreshAccount();
          setCurrentPacket(null);
          
          if (demoMode) {
            setCurrentStep(6); // Final step
          }
        } else if (failed.length > 0) {
          toast.error(`Clearance Rejected: Cryptographic validation check failed!`);
          addConsoleLog('danger', `Decryption Rejected: ${failed[0].error || 'Invalid signature'}`);
        } else {
          toast.info('No packets detected in the gateway queue.');
          addConsoleLog('warning', 'Clearance finished: queue was empty.');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Settlement failed');
      addConsoleLog('danger', `Clearance Failure: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSettling(false);
    }
  };

  // Reset Simulator
  const handleReset = async () => {
    addConsoleLog('warning', 'Re-routing simulation registry, clearing databases...');
    try {
      const res = await resetMeshSimulation();
      if (res.success) {
        setCurrentPacket(null);
        setIsTampered(false);
        toast.info('Simulator reset successful.');
        addConsoleLog('info', 'Simulator reset complete. Ledgers and devices refreshed.');
        fetchRegistry();
        if (demoMode) {
          setCurrentStep(1);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Reset failed');
    }
  };

  // Tamper packet simulation locally
  const handleTamperPacket = () => {
    setIsTampered(true);
    toast.warning('Packet ciphertext tampered! Signatures are now mismatched.');
    addConsoleLog('warning', 'Packet Intrusion: Modified ciphertext strings to mock payload tampering.');
  };

  const getDeviceStatus = (id) => {
    const dev = devices.find(d => d.deviceId === id);
    return dev && dev.isOnline ? 'online' : 'offline';
  };

  const isAliceToS1Active = getDeviceStatus('phone-alice') === 'online' && getDeviceStatus('stranger-1') === 'online';
  const isBobToS1Active = getDeviceStatus('phone-bob') === 'online' && getDeviceStatus('stranger-1') === 'online';
  const isS1ToS2Active = getDeviceStatus('stranger-1') === 'online' && getDeviceStatus('stranger-2') === 'online';
  const isS2ToBridgeActive = getDeviceStatus('stranger-2') === 'online' && getDeviceStatus('bridge-node') === 'online';

  if (loading) {
    return <Loader size="lg" text="Syncing mesh registry database..." />;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-black font-orbitron text-white">DECENTRALIZED MESH SIMULATOR</h1>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Simulate and monitor offline peer-to-peer digital payments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} icon={FiRotateCcw}>
            Reset Mesh
          </Button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-grotesk font-semibold transition-all ${
                isActive
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <t.icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Demo Mode Step Guide Card */}
      {demoMode && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between text-xs text-primary">
          <div className="flex items-center gap-2">
            <FiInfo className="h-4.5 w-4.5 flex-shrink-0" />
            <span>
              {currentStep === 1 && '👉 Step 1: Ensure all devices are active (Online) in the registry cards below.'}
              {currentStep === 2 && '👉 Step 2: Navigate to "Offline Payments" tab to draft and sign Alice\'s invoice.'}
              {currentStep === 3 && '👉 Step 3: Trigger the gossip protocol inside "Mesh Topology" to broadcast the packet.'}
              {currentStep === 4 && '👉 Step 4: Click "Clear Gateway Queue" to submit the packet from Bridge to Bank API.'}
              {currentStep === 5 && '👉 Step 5: Test tampering detection in the "Packets & Security" inspector tab.'}
              {currentStep === 6 && '👉 Step 6: Demo successfully complete! Review settled ledger rows in Dashboard.'}
            </span>
          </div>
          <button
            onClick={() => {
              if (currentStep === 1) handleTabChange('payments');
              if (currentStep === 2) handleTabChange('payments');
              if (currentStep === 3) handleTabChange('network');
              if (currentStep === 4) handleTabChange('network');
              if (currentStep === 5) handleTabChange('packets');
              if (currentStep === 6) navigate('/dashboard');
            }}
            className="font-bold underline hover:text-white flex-shrink-0"
          >
            Take Me There &gt;
          </button>
        </div>
      )}

      {/* Active Tab Workspace rendering */}
      <div>
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-base font-bold font-grotesk text-white">Registry User Terminals</h3>
                <p className="text-xs text-text-muted mt-0.5">Active simulation devices currently registered in this local node list.</p>
              </div>
            </div>

            {devices.length === 0 ? (
              <div className="glass-card p-12 rounded-2xl border border-white/5 text-center max-w-md mx-auto space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-text-muted">
                  <FiCpu className="h-6 w-6" />
                </div>
                <h4 className="font-grotesk font-bold text-white text-base">No Registry Found</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  The local virtual mesh registry database is empty. Click reset below to initialize.
                </p>
                <Button variant="primary" size="sm" onClick={handleReset}>
                  Initialize Default Registry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => {
                  const enriched = enrichDevice(device);
                  return (
                    <div
                      key={device.deviceId}
                      className="glass-card rounded-2xl border border-white/5 p-5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-48 group relative overflow-hidden"
                    >
                      {/* Glow elements */}
                      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-10 ${
                        device.isOnline ? 'bg-secondary' : 'bg-danger'
                      }`} />

                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <span className="text-[9px] text-text-muted font-mono uppercase tracking-wider block mb-0.5">{enriched.role}</span>
                          <h4 className="text-sm font-bold font-grotesk text-white group-hover:text-primary transition-colors">{enriched.name}</h4>
                          <span className="text-[10px] text-text-muted font-mono block mt-0.5">{enriched.connection}</span>
                        </div>
                        <Badge status={device.isOnline ? 'online' : 'offline'}>
                          {device.isOnline ? 'ONLINE' : 'OFFLINE'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 border-t border-b border-white/5 py-3 my-3 text-[10px] font-mono text-text-muted relative z-10">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-text-muted/60 mb-0.5 flex items-center gap-0.5"><FiBattery className="h-2.5 w-2.5" /> Bat</span>
                          <span className="text-white font-bold">{enriched.battery}%</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-text-muted/60 mb-0.5">Signal</span>
                          <span className="text-white font-bold">{enriched.signal}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-text-muted/60 mb-0.5">Queue</span>
                          <span className="text-secondary font-bold">{device.queue?.length || 0} pkts</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center relative z-10">
                        <span className="text-[10px] text-text-muted font-mono">ID: {device.deviceId}</span>
                        <button
                          onClick={() => handleToggleNode(device.deviceId)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold font-grotesk border transition-all ${
                            device.isOnline
                              ? 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/25'
                              : 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/25'
                          }`}
                        >
                          {device.isOnline ? 'Go Offline' : 'Go Online'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {demoMode && currentStep === 1 && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => {
                    setCurrentStep(2);
                    handleTabChange('payments');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-background-primary text-xs font-grotesk font-bold hover:bg-primary/90 transition-all shadow-lg"
                >
                  <span>Proceed to Payment Creation</span>
                  <FiPlay className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="max-w-xl mx-auto glass-card rounded-2xl border border-white/5 p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full radial-glow-blue opacity-20 pointer-events-none" />
            <div>
              <h3 className="text-lg font-bold font-grotesk text-white">Offline Payment Authorizer</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Fill the invoice details. Since the sender's device operates in <strong>offline mode</strong>, the payment payload is bundled, encrypted using public-key cryptography, and signed locally.
              </p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreatePacket(); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-text-muted uppercase font-mono block mb-1">Sender VPA (Offline)</label>
                  <select
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none font-sans"
                  >
                    <option value="phone-alice">Alice (alice@upimesh)</option>
                    <option value="phone-bob">Bob (bob@upimesh)</option>
                  </select>
                  <span className="text-[9px] text-text-muted block mt-1">Source node generating the packet</span>
                </div>

                <div>
                  <label className="text-[10px] text-text-muted uppercase font-mono block mb-1">Receiver VPA (Offline)</label>
                  <select
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none font-sans"
                  >
                    <option value="phone-bob">Bob (bob@upimesh)</option>
                    <option value="phone-alice">Alice (alice@upimesh)</option>
                  </select>
                  <span className="text-[9px] text-text-muted block mt-1">Target node that receives credit</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-text-muted uppercase font-mono block mb-1">Payment Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-text-muted font-mono">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:border-primary outline-none font-mono"
                    placeholder="Enter amount in INR"
                    required
                  />
                </div>
                <span className="text-[9px] text-text-muted block mt-1">Transaction value to clear</span>
              </div>

              <div>
                <label className="text-[10px] text-text-muted uppercase font-mono block mb-1">Maximum Hops (TTL)</label>
                <input
                  type="text"
                  value="5 hops"
                  disabled
                  className="w-full bg-[#111]/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-muted cursor-not-allowed outline-none font-mono"
                />
                <span className="text-[9px] text-primary/80 block mt-1">
                  TTL (Time-to-Live): limits how many devices the packet can hop to prevent mesh flooding.
                </span>
              </div>

              <div className="pt-2">
                {currentPacket ? (
                  <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-secondary text-xs">
                      <FiCheckCircle className="h-4.5 w-4.5 flex-shrink-0 animate-bounce" />
                      <span>Packet cryptographically signed!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('packets')}
                      className="text-xs text-primary hover:underline font-bold font-grotesk"
                    >
                      Inspect Envelope &gt;
                    </button>
                  </div>
                ) : (
                  <Button type="submit" variant="primary" className="w-full py-2.5 text-xs">
                    Create & Sign Cryptographic Packet
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'packets' && (
          <div className="space-y-6">
            {/* Packet Lifecycle Timeline */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 text-left">
              <h3 className="text-sm font-bold font-orbitron text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <FiLayers className="text-primary" /> Visual Packet Journey
              </h3>
              
              {currentPacket ? (
                <div className="relative p-2">
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/5 -translate-y-1/2 z-0 hidden md:block" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                    {[
                      {
                        label: '1. Sign Packet',
                        desc: 'Alice private key signature',
                        status: 'active',
                        time: 'Created Offline'
                      },
                      {
                        label: '2. RSA/AES Cipher',
                        desc: 'Double-envelope encryption',
                        status: 'active',
                        time: 'Secured'
                      },
                      {
                        label: '3. BLE Gossip Routing',
                        desc: isGossiping ? 'Broadcasting...' : 'Cached on Relay Nodes',
                        status: isGossiping || currentPacket ? 'active' : 'pending',
                        time: isGossiping ? 'Active' : 'Awaiting upload'
                      },
                      {
                        label: '4. Bridge Ingest',
                        desc: isSettling ? 'Uploading...' : 'Gateway buffer queue',
                        status: isSettling ? 'active' : 'pending',
                        time: isSettling ? 'Pending' : 'Queued'
                      },
                      {
                        label: '5. Settle Ledger',
                        desc: 'Database settlement clear',
                        status: 'pending',
                        time: 'Cleared on DB'
                      }
                    ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center p-4 bg-[#050505]/60 rounded-2xl border border-white/5 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          step.status === 'active' ? 'bg-secondary text-background-primary shadow-lg shadow-secondary/20' : 'bg-white/5 text-text-muted'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="text-xs font-bold text-white mt-2.5 block">{step.label}</span>
                        <span className="text-[10px] text-text-muted block mt-1 leading-relaxed">{step.desc}</span>
                        <span className="text-[9px] text-primary/80 font-mono mt-2 block px-2 py-0.5 rounded-lg bg-primary/5 border border-primary/10">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-text-muted bg-[#050505]/40 rounded-xl border border-dashed border-white/5 space-y-3">
                  <FiBox className="h-8 w-8 mx-auto text-text-muted/60" />
                  <p>No transactions have been initialized yet. Create your first offline payment.</p>
                  <Button variant="primary" size="sm" onClick={() => handleTabChange('payments')}>
                    Go to Payments Form
                  </Button>
                </div>
              )}
            </div>

            {/* Cryptographic Inspector details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 glass-card rounded-2xl border border-white/5 p-6 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FiShield className="text-primary h-5 w-5 animate-pulse" />
                    <h3 className="text-sm font-bold font-grotesk text-white uppercase tracking-wider">Decentralized Crypto Inspector</h3>
                  </div>
                  {currentPacket && (
                    <div className="flex gap-2">
                      {!isTampered ? (
                        <button
                          onClick={handleTamperPacket}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-danger/10 text-danger border border-danger/20 hover:bg-danger/25 text-xs font-semibold font-grotesk transition-all"
                        >
                          <FiAlertTriangle className="h-3.5 w-3.5" />
                          <span>Tamper Ciphertext</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-danger font-mono font-bold uppercase border border-danger/20 bg-danger/5 px-2.5 py-1.5 rounded-xl animate-pulse">
                          ⚠️ Tampering Detected
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {currentPacket ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-3">
                      <div>
                        <span className="text-text-muted block">INTEGRITY CHECK</span>
                        <span className={`font-bold ${isTampered ? 'text-danger' : 'text-secondary'}`}>
                          {isTampered ? '❌ SHA-256 HASH CORRUPTED' : '✅ SECURE SHA-256 SIGNATURE VALID'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-text-muted block">ENVELOPE SYSTEM</span>
                        <span className="text-white font-bold">RSA-2048 / AES-256-GCM</span>
                      </div>
                    </div>

                    <pre className="p-4 bg-[#050505] rounded-xl border border-white/5 overflow-x-auto text-[10px] font-mono text-secondary leading-relaxed max-h-72">
                      {JSON.stringify(
                        {
                          packetId: currentPacket.packetId,
                          version: currentPacket.version,
                          sender: currentPacket.sender,
                          receiver: currentPacket.receiver,
                          amount: currentPacket.amount,
                          keyId: currentPacket.keyId,
                          iv: isTampered ? 'CorruptedIvDataString0000000000000000000==' : currentPacket.iv,
                          authTag: isTampered ? 'CorruptedAuthTag0000==' : currentPacket.authTag,
                          ciphertext: isTampered ? 'XyZ123CorruptedCiphertextString000000000000==' : currentPacket.ciphertext,
                          packetHash: isTampered ? '0000000000000000000000000000000000000000000000000000000000000000' : currentPacket.packetHash,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs text-text-muted">
                    No active cryptographic envelopes discovered yet.
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 glass-card rounded-2xl border border-white/5 p-6 text-left space-y-4">
                <h4 className="font-grotesk font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5"><FiInfo className="text-primary" /> Terminology Glossary</h4>
                
                <div className="space-y-4 text-[11px] text-text-muted leading-relaxed">
                  <div>
                    <span className="font-mono text-white font-bold block mb-1">RSA Encryption</span>
                    <p>Uses Alice's private key to sign the request. The bank's public key encrypts the inner details to keep them secret from relayers.</p>
                  </div>
                  <div>
                    <span className="font-mono text-white font-bold block mb-1">SHA-256 Hash Integrity</span>
                    <p>Hashing binds the ciphertext. If a relay phone tries to modify the packet, the checksum becomes invalid and is dropped.</p>
                  </div>
                  <div>
                    <span className="font-mono text-white font-bold block mb-1">Idempotency Checks</span>
                    <p>The clearing server registers the packet ID. Replaying the same transaction double-spend will trigger a cache clash in Redis, blocking the second execution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Map topology visualizer */}
              <div className="lg:col-span-8 glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full radial-glow-purple opacity-10 pointer-events-none" />
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider flex items-center gap-2">
                    <FiGlobe className="text-primary animate-pulse" /> Topological Routing Mesh
                  </h3>
                </div>

                <div className="h-[280px] w-full flex items-center justify-center bg-[#050505]/40 rounded-xl relative border border-white/5">
                  <svg className="w-full h-full max-w-lg" viewBox="0 0 500 280">
                    {/* Connections */}
                    <line
                      x1="80" y1="190" x2="200" y2="120"
                      stroke={isAliceToS1Active ? '#00E5FF' : '#222'}
                      strokeWidth="2.5"
                      strokeDasharray={currentPacket && sender === 'phone-alice' && isAliceToS1Active ? '5,5' : '0'}
                      className={currentPacket && sender === 'phone-alice' && isAliceToS1Active && !isSettling ? 'animate-[marquee_1s_infinite_linear]' : ''}
                    />
                    <line
                      x1="80" y1="70" x2="200" y2="120"
                      stroke={isBobToS1Active ? '#00E5FF' : '#222'}
                      strokeWidth="2.5"
                      strokeDasharray={currentPacket && sender === 'phone-bob' && isBobToS1Active ? '5,5' : '0'}
                      className={currentPacket && sender === 'phone-bob' && isBobToS1Active && !isSettling ? 'animate-[marquee_1s_infinite_linear]' : ''}
                    />
                    <line
                      x1="200" y1="120" x2="320" y2="120"
                      stroke={isS1ToS2Active ? '#6C63FF' : '#222'}
                      strokeWidth="2.5"
                      strokeDasharray={currentPacket && isS1ToS2Active ? '5,5' : '0'}
                      className={currentPacket && isS1ToS2Active && !isSettling ? 'animate-[marquee_1s_infinite_linear]' : ''}
                    />
                    <line
                      x1="320" y1="120" x2="420" y2="180"
                      stroke={isS2ToBridgeActive ? '#00FF95' : '#222'}
                      strokeWidth="2.5"
                      strokeDasharray={currentPacket && isS2ToBridgeActive ? '5,5' : '0'}
                      className={currentPacket && isS2ToBridgeActive && !isSettling ? 'animate-[marquee_1s_infinite_linear]' : ''}
                    />

                    {/* Packet flow particles */}
                    {currentPacket && isGossiping && (
                      <>
                        {sender === 'phone-alice' && isAliceToS1Active && (
                          <circle r="5" fill="#00E5FF">
                            <animateMotion dur="2.5s" repeatCount="indefinite" path="M80,190 L200,120" />
                          </circle>
                        )}
                        {sender === 'phone-bob' && isBobToS1Active && (
                          <circle r="5" fill="#00E5FF">
                            <animateMotion dur="2.5s" repeatCount="indefinite" path="M80,70 L200,120" />
                          </circle>
                        )}
                        {isS1ToS2Active && (
                          <circle r="5" fill="#6C63FF">
                            <animateMotion dur="2.5s" begin="0.8s" repeatCount="indefinite" path="M200,120 L320,120" />
                          </circle>
                        )}
                        {isS2ToBridgeActive && (
                          <circle r="5" fill="#00FF95">
                            <animateMotion dur="2.5s" begin="1.6s" repeatCount="indefinite" path="M320,120 L420,180" />
                          </circle>
                        )}
                      </>
                    )}

                    {/* Nodes */}
                    <g onClick={() => handleToggleNode('phone-alice')} className="cursor-pointer group">
                      <circle cx="80" cy="190" r="16" fill="#111" stroke={getDeviceStatus('phone-alice') === 'online' ? '#00E5FF' : '#444'} strokeWidth="3" />
                      <text x="80" y="194" textAnchor="middle" fill={getDeviceStatus('phone-alice') === 'online' ? '#00E5FF' : '#444'} fontSize="9" fontWeight="bold" fontFamily="Orbitron">A</text>
                      <text x="80" y="218" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">Alice (Sender)</text>
                    </g>

                    <g onClick={() => handleToggleNode('phone-bob')} className="cursor-pointer group">
                      <circle cx="80" cy="70" r="16" fill="#111" stroke={getDeviceStatus('phone-bob') === 'online' ? '#00E5FF' : '#444'} strokeWidth="3" />
                      <text x="80" y="74" textAnchor="middle" fill={getDeviceStatus('phone-bob') === 'online' ? '#00E5FF' : '#444'} fontSize="9" fontWeight="bold" fontFamily="Orbitron">B</text>
                      <text x="80" y="98" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">Bob (Receiver)</text>
                    </g>

                    <g onClick={() => handleToggleNode('stranger-1')} className="cursor-pointer group">
                      <circle cx="200" cy="120" r="14" fill="#111" stroke={getDeviceStatus('stranger-1') === 'online' ? '#6C63FF' : '#444'} strokeWidth="2.5" />
                      <text x="200" y="123" textAnchor="middle" fill={getDeviceStatus('stranger-1') === 'online' ? '#6C63FF' : '#444'} fontSize="8" fontWeight="bold" fontFamily="Orbitron">S1</text>
                      <text x="200" y="145" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="Space Grotesk">Stranger-1</text>
                    </g>

                    <g onClick={() => handleToggleNode('stranger-2')} className="cursor-pointer group">
                      <circle cx="320" cy="120" r="14" fill="#111" stroke={getDeviceStatus('stranger-2') === 'online' ? '#6C63FF' : '#444'} strokeWidth="2.5" />
                      <text x="320" y="123" textAnchor="middle" fill={getDeviceStatus('stranger-2') === 'online' ? '#6C63FF' : '#444'} fontSize="8" fontWeight="bold" fontFamily="Orbitron">S2</text>
                      <text x="320" y="145" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="Space Grotesk">Stranger-2</text>
                    </g>

                    <g onClick={() => handleToggleNode('bridge-node')} className="cursor-pointer group">
                      <circle cx="420" cy="180" r="18" fill="#111" stroke={getDeviceStatus('bridge-node') === 'online' ? '#00FF95' : '#444'} strokeWidth="3.5" />
                      <text x="420" y="184" textAnchor="middle" fill={getDeviceStatus('bridge-node') === 'online' ? '#00FF95' : '#444'} fontSize="10" fontWeight="bold" fontFamily="Orbitron">GW</text>
                      <text x="420" y="208" textAnchor="middle" fill={getDeviceStatus('bridge-node') === 'online' ? '#00FF95' : '#444'} fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">Bridge Node</text>
                    </g>
                  </svg>
                </div>
                
                <p className="text-[10px] text-text-muted mt-3 text-center">
                  💡 Click node circles in the graph to turn them online/offline and check propagation path updates dynamically.
                </p>
              </div>

              {/* Simulation triggers desk */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-5 text-left">
                  <h3 className="text-xs font-bold font-orbitron text-white uppercase tracking-wider">Mesh Actions Desk</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-text-muted font-mono block mb-1">Gossip Broadcast Round</span>
                      <Button
                        variant="accent"
                        onClick={handleGossipStep}
                        disabled={!currentPacket || isGossiping}
                        className="w-full py-2.5 text-xs"
                        loading={isGossiping}
                        icon={FiShuffle}
                      >
                        Gossip Propagate BLE
                      </Button>
                      <span className="text-[9px] text-text-muted block mt-1.5 leading-normal">
                        Simulates Bluetooth mesh advertising. Encrypted packets hop device-to-device towards the Bridge Gateway.
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] text-text-muted font-mono block mb-1">Internet Bridge Node</span>
                      <Button
                        variant="secondary"
                        onClick={handleSettlePayments}
                        disabled={!currentPacket || isSettling}
                        className="w-full py-2.5 text-xs"
                        loading={isSettling}
                        icon={FiPlay}
                      >
                        Clear Gateway Queue
                      </Button>
                      <span className="text-[9px] text-text-muted block mt-1.5 leading-normal">
                        Ingests packets queued on the Bridge Node, decrypts RSA cipher envelopes, and commits settlement atomic logs on server database.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Console Log Feed */}
            <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col h-[280px] text-left">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-3">
                <FiTerminal className="h-4.5 w-4.5 text-secondary" />
                <h3 className="text-xs font-bold font-grotesk text-white uppercase tracking-wider">Live Telemetry Console</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] leading-relaxed scroll-smooth">
                {consoleLogs.length === 0 ? (
                  <div className="text-text-muted text-center py-12">Waiting for node simulation events...</div>
                ) : (
                  consoleLogs.map((log) => (
                    <div key={log.id} className="flex gap-2">
                      <span className="text-text-muted">[{log.time}]</span>
                      <span className={
                        log.type === 'success' ? 'text-secondary' :
                        log.type === 'warning' ? 'text-warning' :
                        log.type === 'danger' || log.type === 'error' ? 'text-danger' : 'text-primary'
                      }>
                        [{log.type.toUpperCase()}]
                      </span>
                      <span className="text-white">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;
