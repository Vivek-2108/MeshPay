import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiActivity, FiCpu, FiClock } from 'react-icons/fi';

const Analytics = () => {
  // Chart 1: Volume Trend (Mock Data)
  const volumeData = [
    { name: '00:00', volume: 1200, tx: 5 },
    { name: '04:00', volume: 2400, tx: 8 },
    { name: '08:00', volume: 1800, tx: 6 },
    { name: '12:00', volume: 4800, tx: 15 },
    { name: '16:00', volume: 3600, tx: 12 },
    { name: '20:00', volume: 5400, tx: 18 },
    { name: '24:00', volume: 4200, tx: 14 },
  ];

  // Chart 2: Latency vs Hop Count (Mock Data)
  const latencyData = [
    { hop: '1 Hop', latency: 240 },
    { hop: '2 Hops', latency: 480 },
    { hop: '3 Hops', latency: 710 },
    { hop: '4 Hops', latency: 950 },
    { hop: '5 Hops', latency: 1220 },
  ];

  // Chart 3: Node traffic share (Mock Data)
  const trafficData = [
    { name: 'Direct BLE', value: 400, color: '#00E5FF' },
    { name: 'Stranger 1 Relay', value: 300, color: '#6C63FF' },
    { name: 'Stranger 2 Relay', value: 200, color: '#FFC857' },
    { name: 'Bridge Gateway', value: 500, color: '#00FF95' },
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-black font-orbitron text-white">NETWORK ANALYTICS</h1>
        <p className="text-sm text-text-muted mt-1 font-sans">
          Analyze transaction volumes, routing hop latencies, and device contribution metrics
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Propagation Latency', value: '710 ms', desc: 'Average hop transfer speed', icon: FiClock, color: 'text-primary' },
          { label: 'Network Packet Success', value: '99.4 %', desc: 'SHA-256 validation pass rate', icon: FiTrendingUp, color: 'text-secondary' },
          { label: 'Active Relay Nodes', value: '4 nodes', desc: 'Participating mesh repeaters', icon: FiCpu, color: 'text-accent' },
          { label: 'Total Volume Routed', value: '23,400 INR', desc: 'Total transaction value settled', icon: FiActivity, color: 'text-warning' },
        ].map((kpi, idx) => (
          <div key={idx} className="glass-card rounded-2xl border border-white/5 p-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-muted font-mono tracking-widest uppercase block mb-1">{kpi.label}</span>
              <span className="font-mono text-2xl font-black text-white">{kpi.value}</span>
              <span className="text-[10px] text-text-muted block mt-1">{kpi.desc}</span>
            </div>
            <div className={`p-3 rounded-xl bg-white/5 ${kpi.color}`}>
              <kpi.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Area Chart: Volume trend */}
        <div className="lg:col-span-8 glass-card rounded-2xl border border-white/5 p-6">
          <h3 className="text-base font-bold font-grotesk text-white mb-6 uppercase tracking-wider">
            Ledger Clearance Volume Trend (INR)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={10} fontFamily="Space Grotesk" />
                <YAxis stroke="#666" fontSize={10} fontFamily="Space Grotesk" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontFamily: 'Orbitron', fontSize: '10px' }}
                  itemStyle={{ color: '#00E5FF', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#00E5FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Share donut */}
        <div className="lg:col-span-4 glass-card rounded-2xl border border-white/5 p-6 flex flex-col">
          <h3 className="text-base font-bold font-grotesk text-white mb-6 uppercase tracking-wider">
            Node Routing Share
          </h3>
          <div className="flex-1 h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] text-text-muted uppercase font-mono">Routing</span>
              <span className="font-mono text-lg font-black text-white">BLE Share</span>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-text-muted font-grotesk">
            {trafficData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 justify-start">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Latency vs Hops */}
        <div className="lg:col-span-12 glass-card rounded-2xl border border-white/5 p-6">
          <h3 className="text-base font-bold font-grotesk text-white mb-6 uppercase tracking-wider">
            Average Packet Propagation Latency (ms) by Hop Count
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="hop" stroke="#666" fontSize={10} fontFamily="Space Grotesk" />
                <YAxis stroke="#666" fontSize={10} fontFamily="Space Grotesk" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '10px' }}
                  itemStyle={{ color: '#6C63FF', fontSize: '12px' }}
                />
                <Bar dataKey="latency" fill="#6C63FF" radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
