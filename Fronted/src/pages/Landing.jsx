import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import { FiActivity, FiShield, FiRadio, FiCheckCircle, FiCpu, FiTrendingUp, FiLock, FiTerminal } from 'react-icons/fi';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, type: 'spring' } }
  };

  return (
    <div className="bg-background-primary min-h-screen relative overflow-hidden">
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 mesh-grid opacity-30 z-0 pointer-events-none" />
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full radial-glow-blue opacity-40 z-0 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[45vw] h-[45vw] rounded-full radial-glow-purple opacity-40 z-0 pointer-events-none" />
      <div className="noise-overlay" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="lg:col-span-7 space-y-6 text-left"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
             border border-[#D4AF37]/40
             bg-gradient-to-r from-[#FFF8DC]/10 via-[#D4AF37]/10 to-[#B8860B]/10
             backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.8)]" />

            <span className="text-xs font-mono font-semibold tracking-wider text-transparent bg-clip-text bg-[linear-gradient(90deg,#FFF8DC_0%,#F7E7A1_20%,#FFD700_40%,#D4AF37_60%,#B8860B_80%,#FFF8DC_100%)]">
              UPI PROTOCOL v1.0.0 (OFFLINE DEPLOYMENT)
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-black font-orbitron tracking-tight text-white leading-tight">
            DECENTRALIZED <br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#FFE8D6_0%,#F7C59F_30%,#D89B72_60%,#B76E79_100%)]">
              OFFLINE UPI
            </span> <br />
            MESH PAYMENTS
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base sm:text-lg text-text-muted max-w-xl font-sans leading-relaxed">
            MeshPay enables secure peer-to-peer UPI transfers completely without internet. Data packets hop securely through intermediate devices via Bluetooth Mesh until reaching an internet-enabled Bridge Node.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Start Demo
              </Button>
            </Link>
            <Link to="/simulator">
              <Button variant="outline" size="lg" icon={FiActivity}>
                Launch Simulator
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Interactive Topological Animated SVG Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="lg:col-span-5 relative w-full h-[380px] sm:h-[450px] glass-card rounded-3xl border border-white/10 p-6 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

          <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-4">
            <span className="text-xs font-bold font-grotesk tracking-widest text-text-muted uppercase">
              TOPOLOGICAL ROUTING MAP
            </span>
            <span className="px-2.5 py-1 rounded bg-secondary/10 border border-secondary/20 text-[10px] font-mono text-secondary font-bold animate-pulse">
              LIVE BROADCASTING
            </span>
          </div>

          {/* SVG Animated Graph */}
          <div className="flex-1 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Lines (Connections) */}
              {/* Alice -> Stranger-1 */}
              <line x1="60" y1="210" x2="160" y2="130" stroke="#00E5FF" strokeWidth="2" strokeDasharray="5,5" className="animate-[marquee_1.5s_infinite_linear]" opacity="0.6" />
              {/* Bob -> Stranger-1 */}
              <line x1="60" y1="70" x2="160" y2="130" stroke="#00E5FF" strokeWidth="2" strokeDasharray="5,5" className="animate-[marquee_1.5s_infinite_linear]" opacity="0.6" />
              {/* Stranger-1 -> Stranger-2 */}
              <line x1="160" y1="130" x2="260" y2="130" stroke="#6C63FF" strokeWidth="2" strokeDasharray="5,5" className="animate-[marquee_1.5s_infinite_linear]" opacity="0.6" />
              {/* Stranger-2 -> Bridge */}
              <line x1="260" y1="130" x2="340" y2="190" stroke="#00FF95" strokeWidth="2" strokeDasharray="5,5" className="animate-[marquee_1.5s_infinite_linear]" opacity="0.6" />

              {/* Glowing animated packets */}
              {/* Alice -> Stranger 1 packet */}
              <circle r="4" fill="#00E5FF">
                <animateMotion dur="4s" repeatCount="indefinite" path="M60,210 L160,130" />
              </circle>
              {/* Stranger 1 -> Stranger 2 packet */}
              <circle r="4" fill="#6C63FF">
                <animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M160,130 L260,130" />
              </circle>
              {/* Stranger 2 -> Bridge packet */}
              <circle r="4" fill="#00FF95">
                <animateMotion dur="4s" begin="4s" repeatCount="indefinite" path="M260,130 L340,190" />
              </circle>

              {/* Nodes */}
              {/* Alice Node */}
              <g className="cursor-pointer">
                <circle cx="60" cy="210" r="16" fill="#111111" stroke="#00E5FF" strokeWidth="3" />
                <text x="60" y="214" textAnchor="middle" fill="#00E5FF" fontSize="9" fontWeight="bold" fontFamily="Orbitron">A</text>
                <text x="60" y="235" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">Alice (Offline)</text>
              </g>

              {/* Bob Node */}
              <g className="cursor-pointer">
                <circle cx="60" cy="70" r="16" fill="#111111" stroke="#00E5FF" strokeWidth="3" />
                <text x="60" y="74" textAnchor="middle" fill="#00E5FF" fontSize="9" fontWeight="bold" fontFamily="Orbitron">B</text>
                <text x="60" y="95" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">Bob (Offline)</text>
              </g>

              {/* Stranger 1 Node */}
              <g className="cursor-pointer">
                <circle cx="160" cy="130" r="14" fill="#111" stroke="#6C63FF" strokeWidth="2.5" />
                <text x="160" y="133" textAnchor="middle" fill="#6C63FF" fontSize="8" fontWeight="bold" fontFamily="Orbitron">S1</text>
                <text x="160" y="155" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="Space Grotesk">Stranger-1</text>
              </g>

              {/* Stranger 2 Node */}
              <g className="cursor-pointer">
                <circle cx="260" cy="130" r="14" fill="#111" stroke="#6C63FF" strokeWidth="2.5" />
                <text x="260" y="133" textAnchor="middle" fill="#6C63FF" fontSize="8" fontWeight="bold" fontFamily="Orbitron">S2</text>
                <text x="260" y="155" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="Space Grotesk">Stranger-2</text>
              </g>

              {/* Bridge Node (Internet Gateway) */}
              <g className="cursor-pointer">
                <circle cx="340" cy="190" r="18" fill="#111" stroke="#00FF95" strokeWidth="3.5" className="animate-pulse" />
                <text x="340" y="194" textAnchor="middle" fill="#00FF95" fontSize="10" fontWeight="bold" fontFamily="Orbitron">GW</text>
                <text x="340" y="218" textAnchor="middle" fill="#00FF95" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">Bridge (Online)</text>
              </g>
            </svg>
          </div>

          <div className="border-t border-white/5 pt-3 text-left">
            <span className="text-[10px] text-text-muted font-mono block leading-normal">
              &gt; payload: AES-256-GCM Encrypted Packet
            </span>
            <span className="text-[10px] text-secondary font-mono block leading-normal">
              &gt; path: Alice --(BLE)--&gt; S1 --(BLE)--&gt; S2 --(BLE)--&gt; Gateway --(Internet)--&gt; Bank Api
            </span>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black font-orbitron tracking-tight text-white mb-4 uppercase">
            SECURE ROUTING ARCHITECTURE
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto mb-4" />
          <p className="text-sm text-text-muted font-sans leading-relaxed">
            MeshPay is engineered to protect transactional integrity using banking-grade security mechanisms designed specifically for peer-to-peer mesh routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              icon: FiRadio,
              title: 'Offline Payments',
              description: 'Create and sign valid UPI payment packets even inside remote networks, underground spaces, or internet blockages.',
              color: 'text-primary border-primary/10 hover:border-primary/30',
            },
            {
              icon: FiLock,
              title: 'Secure Encryption',
              description: 'Dual-layer encryption using RSA-2048 keys and ephemeral AES-256-GCM payloads ensures intermediate hops cannot inspect balances.',
              color: 'text-accent border-accent/10 hover:border-accent/30',
            },
            {
              icon: FiCpu,
              title: 'Mesh Routing',
              description: 'Decentralized routing dynamically selects the fastest, most reliable path to relay packets through nearby devices.',
              color: 'text-secondary border-secondary/10 hover:border-secondary/30',
            },
            {
              icon: FiCheckCircle,
              title: 'Deferred Settlement',
              description: 'Integrates Redis caching to prevent double-spending and transaction replays across multiple intermediate node channels.',
              color: 'text-warning border-warning/10 hover:border-warning/30',
            },
            {
              icon: FiActivity,
              title: 'Real-time Monitoring',
              description: 'Examine packet propagation latency metrics and inspect cryptographical signature records directly on our active console feed.',
              color: 'text-primary border-primary/10 hover:border-primary/30',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className={`glass-card p-5 rounded-2xl border ${item.color} flex flex-col items-start text-left transition-all duration-300`}
            >
              <div className="p-3 rounded-xl bg-white/5 mb-5 text-current">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold font-grotesk text-white mb-2.5">{item.title}</h3>
              <p className="text-[11px] text-text-muted leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Timeline */}
      <section id="how-it-works" className="py-20 px-6 bg-[#0B0B0B]/40 border-t border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black font-orbitron tracking-tight text-white mb-4 uppercase">
              TRANSACTION LIFECYCLE
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-accent to-secondary mx-auto mb-4" />
            <p className="text-sm text-text-muted font-sans leading-relaxed">
              How a transaction moves from offline creation to online bank clearance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
            {/* Timeline connectors */}
            <div className="hidden lg:block absolute top-[40px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-primary via-accent to-secondary opacity-30 z-0" />

            {[
              {
                step: '01',
                title: 'Authorize & Sign',
                subtitle: 'Offline Device',
                desc: 'The user creates a transaction. The client app generates a unique transaction signature using the user\'s local RSA private key.',
                color: 'text-primary border-primary/20',
              },
              {
                step: '02',
                title: 'Broadcast Packet',
                subtitle: 'Bluetooth Mesh Hop',
                desc: 'The signed payload is packaged, double-encrypted, and broadcasted to nearby nodes using Bluetooth Low Energy advertising packets.',
                color: 'text-accent border-accent/20',
              },
              {
                step: '03',
                title: 'Mesh Relay Hops',
                subtitle: 'Intermediate Nodes',
                desc: 'Other devices receive, cache, and re-broadcast the packet. Intermediate nodes cannot tamper with or inspect the encrypted ledger data.',
                color: 'text-accent border-accent/20',
              },
              {
                step: '04',
                title: 'Ingest & Settle',
                subtitle: 'Online Bridge Node',
                desc: 'An internet-enabled Bridge Node captures the packet, forwards it to our server. The server verifies integrity and clears funds.',
                color: 'text-secondary border-secondary/20',
              },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center max-w-xs mx-auto">
                <div className={`h-16 w-16 rounded-2xl border ${step.color} bg-[#111] flex items-center justify-center font-orbitron font-black text-lg text-white mb-6 shadow-lg`}>
                  {step.step}
                </div>
                <h3 className="text-base font-bold font-grotesk text-white mb-1">{step.title}</h3>
                <span className="text-[10px] text-secondary font-mono font-bold tracking-widest uppercase block mb-3">{step.subtitle}</span>
                <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Architecture Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="text-3xl font-black font-orbitron tracking-tight text-white uppercase">
              HIGH PERFORMANCE CORE ARCHITECTURE
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent" />
            <p className="text-sm text-text-muted leading-relaxed">
              MeshPay integrates high-speed verification caching with a reliable datastore core to protect payments.
            </p>
            <div className="space-y-3 font-grotesk text-sm">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-white"><strong>React 19 Frontend:</strong> Rich visual dashboard & gossip inspector.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-white"><strong>Node.js Backend:</strong> Express server routing with RSA-2048 keys.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-white"><strong>Redis Database:</strong> Caches signatures to prevent replay attacks.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <span className="text-white"><strong>MongoDB Atlas:</strong> Persistent ledger of accounts and transactions.</span>
              </div>
            </div>
            <div className="pt-4">
              <Link to="/simulator">
                <Button variant="primary" icon={FiTerminal}>
                  Launch Interactive Simulator
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {[
              { title: 'Frontend Interface', tech: 'React / Framer Motion / Recharts', label: 'Visualization Layer', desc: 'Directs the node simulator, plots latency analysis charts, and displays transaction history logs.' },
              { title: 'Backend Router', tech: 'Express / Cryptography Engine', label: 'Processing Layer', desc: 'Validates SHA-256 packet integrity hashes, checks signatures, and manages account records.' },
              { title: 'Redis Cache', tech: 'In-Memory Key/Value Store', label: 'Verification Layer', desc: 'Guarantees transaction idempotency. Checks packets instantly to safeguard against double spending.' },
              { title: 'MongoDB Core', tech: 'Persistent NoSQL Store', label: 'Persistence Layer', desc: 'Holds the system ledger, stores cryptographic user profiles, and logs settled transactions.' },
            ].map((card, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 text-left flex flex-col justify-between hover:border-white/10 transition-all duration-300">
                <div>
                  <span className="text-[9px] font-mono text-primary uppercase font-bold tracking-widest block mb-2">{card.label}</span>
                  <h4 className="text-base font-bold font-grotesk text-white mb-1">{card.title}</h4>
                  <span className="text-[10px] text-text-muted font-mono font-semibold block mb-4">{card.tech}</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
