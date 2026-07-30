import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { useDemo } from '../context/DemoContext';
import { getTransactions } from '../services/auth';
import { toggleDeviceStatus } from '../services/mesh';
import socketService from '../services/socket';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import {
  FiTrendingUp,
  FiRadio,
  FiLayers,
  FiDollarSign,
  FiPlus,
  FiArrowDownRight,
  FiArrowUpRight,
  FiRefreshCw,
  FiInfo,
  FiChevronRight,
  FiCheckCircle,
  FiActivity,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, account, refreshAccount } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { demoMode, setDemoMode, currentStep, setCurrentStep } = useDemo();

  const [transactions, setTransactions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceState, setDeviceState] = useState(true); 
  const [togglingDevice, setTogglingDevice] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const data = await getTransactions();
      if (data.success) {
        setTransactions(data.transactions.slice(0, 5));
      }
    } catch (error) {
      console.warn('Failed to load transaction history:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    refreshAccount();

    setLogs([
      { id: '1', timestamp: new Date().toISOString(), type: 'success', message: 'Cryptographic handshake initialized with local registry.' },
      { id: '2', timestamp: new Date().toISOString(), type: 'info', message: 'Bluetooth Mesh: Scanning for adjacent active nodes...' },
    ]);

    const unsubscribe = socketService.subscribe((event, data) => {
      if (event === 'activity') {
        setLogs((prev) => [data, ...prev.slice(0, 9)]);
        if (data.message.toLowerCase().includes('settled') || data.message.toLowerCase().includes('settlement')) {
          refreshAccount();
          fetchDashboardData();
        }
      }
    });

    return () => unsubscribe();
  }, [refreshAccount]);

  const handleDeviceToggle = async () => {
    setTogglingDevice(true);
    const mockDeviceId = 'phone-alice';
    try {
      const response = await toggleDeviceStatus(mockDeviceId);
      if (response.success) {
        setDeviceState(!deviceState);
        toast.success(`Virtual Node "${mockDeviceId}" status set to ${!deviceState ? 'ONLINE' : 'OFFLINE'}`);
        socketService.pushCustomLog(
          !deviceState ? 'online' : 'offline',
          `Local Node Toggle: "${mockDeviceId}" is now ${!deviceState ? 'ACTIVE & BROADCASTING' : 'MUTED & OFFLINE'}`
        );
      }
    } catch (error) {
      toast.error(error.message || 'Failed to toggle device state');
    } finally {
      setTogglingDevice(false);
    }
  };

  if (loading || !account) {
    return <Loader size="lg" text="Syncing ledger credentials..." />;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-black font-orbitron text-white">FINTECH WORKSPACE</h1>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Monitor offline transactions, device connectivity, and peer routing paths.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchDashboardData();
              refreshAccount();
            }}
            className="p-2"
          >
            <FiRefreshCw className="h-4.5 w-4.5" />
          </Button>
          
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-grotesk font-bold border transition-all ${
              demoMode
                ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                : 'bg-white/5 text-text-muted border-white/10 hover:text-white'
            }`}
          >
            {demoMode ? 'Demo Mode: Active' : 'Enable Demo Mode'}
          </button>

          <Link to="/simulator?tab=payments">
            <Button variant="primary" size="sm" icon={FiPlus}>
              New Offline Payment
            </Button>
          </Link>
        </div>
      </div>

      {/* Guided Tour Banner */}
      {demoMode && (
        <div className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold font-mono">
              i
            </div>
            <h3 className="font-grotesk font-black text-sm text-white">Interactive Walkthrough</h3>
          </div>
          <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
            This simulator demonstrates how a payment moves peer-to-peer without internet, hopping across local devices until reaching an online Bridge.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { step: 1, label: '1. Setup Nodes', path: '/simulator?tab=users' },
              { step: 2, label: '2. Create Payment', path: '/simulator?tab=payments' },
              { step: 3, label: '3. BLE Gossip', path: '/simulator?tab=network' },
              { step: 4, label: '4. Bridge Ingest', path: '/simulator?tab=network' },
              { step: 5, label: '5. Tampering Check', path: '/simulator?tab=packets' },
              { step: 6, label: '6. Settlement', path: '/dashboard' }
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStep(s.step);
                  if (s.path !== '/dashboard') {
                    navigate(s.path);
                  }
                }}
                className={`p-2.5 rounded-xl border text-[11px] font-grotesk font-semibold text-center transition-all ${
                  currentStep === s.step
                    ? 'bg-primary text-background-primary border-primary font-bold shadow-md shadow-primary/10'
                    : currentStep > s.step
                    ? 'bg-secondary/15 text-secondary border-secondary/25'
                    : 'bg-white/[0.02] text-text-muted border-white/5 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* What is MeshPay? Educational Section */}
      <div className="glass-card rounded-2xl border border-white/5 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-3">
          <h2 className="text-base font-bold font-grotesk text-white uppercase tracking-wider flex items-center gap-1.5">
            <FiInfo className="text-primary" /> What is MeshPay?
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            MeshPay is a concept implementation of an offline digital payment network. It proves that UPI payments can be executed safely inside areas with zero internet connectivity (e.g. basements, remote terrains) by bundling credentials into highly secure, encrypted cryptographic envelopes.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono text-text-muted pt-1">
            <div>
              <span className="text-secondary font-bold mr-1">●</span>
              <span><strong>BLE Hops:</strong> Offline transfer mechanism</span>
            </div>
            <div>
              <span className="text-primary font-bold mr-1">●</span>
              <span><strong>RSA-2048:</strong> Banking-grade payload sealing</span>
            </div>
            <div>
              <span className="text-accent font-bold mr-1">●</span>
              <span><strong>Bridge Gateways:</strong> Settlement clearance paths</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 p-4 bg-[#050505] rounded-xl border border-white/5 space-y-2.5">
          <span className="text-[9px] font-mono text-primary uppercase tracking-widest block font-bold">Concept Definition</span>
          <span className="font-grotesk font-bold text-xs text-white block">Deferred Settlement</span>
          <p className="text-[10px] text-text-muted leading-relaxed">
            Payments are not debited/credited immediately. Packets are cached on relay devices offline until one device reconnects to internet and forwards the ledger update to the bank API.
          </p>
        </div>
      </div>

      {/* Visual Journey Storytelling row */}
      <div className="glass-card rounded-2xl border border-white/5 p-6 text-left space-y-4">
        <h3 className="text-xs font-bold font-orbitron text-white uppercase tracking-wider">
          Transaction Hop Path Lifecycle
        </h3>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 bg-[#050505]/40 rounded-xl border border-white/5 relative">
          {[
            { title: 'Offline Phone', desc: 'Alice signs packet', status: 'online' },
            { title: 'Relay Node A', desc: 'Device-to-device hop', status: 'relay' },
            { title: 'Relay Node B', desc: 'Mesh propagation', status: 'relay' },
            { title: 'Bridge Gateway', desc: 'Internet connection', status: 'bridge' },
            { title: 'UPI Central', desc: 'Settles ledger', status: 'settled' }
          ].map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-1 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                  item.status === 'online' ? 'bg-primary text-background-primary' :
                  item.status === 'relay' ? 'bg-accent text-white' :
                  item.status === 'bridge' ? 'bg-secondary text-background-primary' :
                  'bg-white/5 text-text-muted'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <span className="font-grotesk font-bold text-xs text-white block">{item.title}</span>
                  <span className="text-[9px] text-text-muted block mt-0.5">{item.desc}</span>
                </div>
              </div>
              {idx < 4 && (
                <div className="hidden lg:block text-text-muted/30">
                  <FiChevronRight className="h-5 w-5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between h-44 relative overflow-hidden group hover:border-white/10 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
            <FiDollarSign className="h-28 w-28 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <span className="text-[9px] text-text-muted font-mono tracking-widest uppercase block mb-1">
              Virtual Account Balance
            </span>
            <span className="font-mono text-3xl font-black text-secondary glow-text-secondary">
              {account.balance?.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </span>
          </div>
          <div className="border-t border-white/5 pt-4 flex justify-between items-center relative z-10">
            <span className="text-[10px] text-text-muted font-mono">VPA: {user.vpa}</span>
            <Badge status="settled">SECURED</Badge>
          </div>
        </div>

        {/* Node Connectivity Status */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between h-44 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] text-text-muted font-mono tracking-widest uppercase block mb-1">
                Virtual Node Status
              </span>
              <h3 className="text-lg font-bold font-grotesk text-white">
                {deviceState ? 'Online / Advertising' : 'Muted / Offline'}
              </h3>
            </div>
            <Badge status={deviceState ? 'online' : 'offline'}>
              {deviceState ? 'ACTIVE' : 'OFFLINE'}
            </Badge>
          </div>

          <div className="border-t border-white/5 pt-4 flex justify-between items-center">
            <span className="text-[10px] text-text-muted font-mono">Node ID: phone-alice</span>
            <button
              onClick={handleDeviceToggle}
              disabled={togglingDevice}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-grotesk transition-all duration-300 ${
                deviceState
                  ? 'bg-danger/10 text-danger hover:bg-danger/25 border border-danger/20'
                  : 'bg-secondary/10 text-secondary hover:bg-secondary/25 border border-secondary/20'
              }`}
            >
              {togglingDevice ? 'Syncing...' : deviceState ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Ledger Statistics */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between h-44 hover:border-white/10 transition-all">
          <div>
            <span className="text-[9px] text-text-muted font-mono tracking-widest uppercase block mb-1">
              Estimated BLE Mesh Hops
            </span>
            <span className="font-mono text-3xl font-black text-primary glow-text-primary">
              12 hops
            </span>
          </div>
          <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-text-muted">
            <span>Gateway Backhaul Connection: </span>
            <span className="text-secondary font-bold font-mono">100% SLA</span>
          </div>
        </div>
      </div>

      {/* Main split grid: Activity Feed & Transactions list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time Activity Feed */}
        <div className="lg:col-span-7 glass-card rounded-2xl border border-white/5 p-6 flex flex-col h-[400px]">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <FiRadio className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="text-base font-bold font-grotesk text-white uppercase tracking-wider">Live Activity Logger</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] leading-relaxed scroll-smooth">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 text-left border-l border-white/10 pl-3">
                <span className="text-text-muted">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-secondary'
                      : log.type === 'warning'
                      ? 'text-warning'
                      : log.type === 'danger' || log.type === 'error'
                      ? 'text-danger'
                      : 'text-primary'
                  }
                >
                  [{log.type || 'info'}]
                </span>
                <span className="text-white flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-5 glass-card rounded-2xl border border-white/5 p-6 flex flex-col h-[400px]">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <FiLayers className="h-5 w-5 text-accent" />
            <h3 className="text-base font-bold font-grotesk text-white uppercase tracking-wider">Recent Ledger Records</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {transactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <FiActivity className="h-8 w-8 text-text-muted/40" />
                <div>
                  <h4 className="font-grotesk font-bold text-xs text-white">No Clearance Records</h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    No transactions have settled yet. Open the simulator to run a payment lifecycle.
                  </p>
                </div>
                <Link to="/simulator?tab=payments">
                  <Button variant="primary" size="sm">
                    Open Simulator
                  </Button>
                </Link>
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      tx.sender === user.vpa 
                        ? 'bg-danger/10 text-danger border border-danger/10' 
                        : 'bg-secondary/10 text-secondary border border-secondary/10'
                    }`}>
                      {tx.sender === user.vpa ? <FiArrowUpRight className="h-5 w-5" /> : <FiArrowDownRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white font-grotesk">
                        {tx.sender === user.vpa ? tx.receiver : tx.sender}
                      </h4>
                      <span className="text-[9px] text-text-muted font-mono">{new Date(tx.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono text-xs font-bold block ${tx.sender === user.vpa ? 'text-danger' : 'text-secondary'}`}>
                      {tx.sender === user.vpa ? '-' : '+'}{tx.amount} INR
                    </span>
                    <Badge status="settled" className="mt-1 scale-90 origin-right">SETTLED</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
