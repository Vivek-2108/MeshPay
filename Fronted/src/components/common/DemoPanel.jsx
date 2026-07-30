import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { FiBookOpen, FiPlay, FiCheck, FiArrowRight, FiInfo, FiLayers } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DemoPanel = () => {
  const { demoMode, setDemoMode, currentStep, setCurrentStep, nextStep, prevStep, resetDemo } = useDemo();
  const [minimized, setMinimized] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  const steps = [
    {
      title: 'Initialize Network & Users',
      desc: 'Check device statuses in the topology map. Nodes can be toggled Online or Offline. Ensure Alice, Bob, and the Bridge Node are ready.',
      glossary: 'Node: Any phone or device in the offline mesh network. Bridge Node: A device that eventually gets internet access and submits transactions.',
    },
    {
      title: 'Create Offline Payment Packet',
      desc: 'Alice wants to pay Bob ₹500. Since she has no internet, the app encrypts the payment details into a secure packet, signed with her private key.',
      glossary: 'Mesh Packet: A secure, encrypted payment instruction traveling offline between devices.',
    },
    {
      title: 'Gossip Transfer (BLE Broadcast)',
      desc: 'Alice\'s phone broadcasts the encrypted packet. Intermediate devices (Stranger-1 & Stranger-2) copy and relay the packet device-to-device.',
      glossary: 'Hop: One wireless transfer from one phone to another. TTL (Time To Live): Max number of hops allowed before the packet expires.',
    },
    {
      title: 'Bridge Gateway Ingestion',
      desc: 'Once the packet hops to the Bridge Node (which has internet access), the packet is stored in its upload queue, ready for the clearing house.',
      glossary: 'Bridge Node: A gateway device linking the offline mesh to the real-world internet.',
    },
    {
      title: 'Cryptographic Integrity Check',
      desc: 'The backend decrypts the transaction with its private key and validates the SHA-256 signature to guarantee no packet tampering has occurred.',
      glossary: 'Tampering Check: Verifying that intermediate nodes did not alter the payment details (like amount or receiver).',
    },
    {
      title: 'Clearance & Settlement',
      desc: 'The transactions are settled atomically. The database updates accounts instantly, showing newly reflected balances.',
      glossary: 'Settlement: The final transfer of actual funds once internet connection is established.',
    },
  ];

  const glossaryItems = [
    { term: 'Mesh Packet', def: 'An encrypted envelope containing payment details (sender, receiver, amount) signed with private keys.' },
    { term: 'Hop', def: 'A single device-to-device wireless transmission (via simulated Bluetooth Low Energy).' },
    { term: 'TTL (Time-To-Live)', def: 'Limits the maximum hops a packet can take to prevent infinite loops in the network.' },
    { term: 'Bridge Node', def: 'A device with internet access that collects offline packets and uploads them to the server.' },
    { term: 'Settlement', def: 'The final settlement of money into bank accounts once internet access is retrieved.' },
  ];

  if (!demoMode) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setDemoMode(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-background-secondary border border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all text-xs font-grotesk font-bold text-white shadow-xl"
        >
          <FiPlay className="h-3.5 w-3.5 text-primary" />
          <span>Enable Guided Demo</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 max-h-[85vh] flex flex-col bg-background-secondary/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-left">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[11px] font-orbitron font-bold tracking-wider text-white">GUIDED DEMO MODE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className={`p-1.5 rounded-lg text-text-muted hover:text-white transition-all ${showGlossary ? 'bg-white/10 text-white' : ''}`}
            title="Mesh Glossary"
          >
            <FiBookOpen className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-xs text-text-muted hover:text-white px-2 py-1 rounded hover:bg-white/5 font-mono"
          >
            {minimized ? 'Expand' : 'Collapse'}
          </button>
          <button
            onClick={() => setDemoMode(false)}
            className="text-xs text-danger/80 hover:text-danger hover:bg-danger/10 px-2 py-1 rounded"
          >
            Exit
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-y-auto flex-1 flex flex-col"
          >
            {showGlossary ? (
              /* Glossary View */
              <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <FiInfo className="text-primary h-4.5 w-4.5" />
                  <h4 className="font-grotesk font-bold text-xs text-white uppercase tracking-wider">Terminology Guide</h4>
                </div>
                <div className="space-y-3">
                  {glossaryItems.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="font-mono text-xs font-bold text-secondary">{item.term}</span>
                      <p className="text-[11px] text-text-muted leading-relaxed">{item.def}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowGlossary(false)}
                  className="w-full text-center text-xs text-primary hover:underline pt-2"
                >
                  Back to Steps
                </button>
              </div>
            ) : (
              /* Step Guide View */
              <div className="p-5 space-y-4">
                {/* Step indicator progress */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-text-muted">Step {currentStep} of {steps.length}</span>
                  <div className="flex gap-1 h-1 flex-1 max-w-[120px] mx-3">
                    {steps.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-full rounded-full transition-all duration-300 ${
                          idx + 1 === currentStep ? 'bg-primary flex-1' :
                          idx + 1 < currentStep ? 'bg-secondary w-2' : 'bg-white/10 w-2'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-secondary font-bold uppercase">
                    {currentStep === steps.length ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                {/* Main Instruction Card */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h4 className="font-grotesk font-black text-sm text-white flex items-center gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold font-mono">
                      {currentStep}
                    </span>
                    {steps[currentStep - 1].title}
                  </h4>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    {steps[currentStep - 1].desc}
                  </p>
                </div>

                {/* Glossary context explanation */}
                <div className="flex gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 text-[10px] text-primary leading-normal">
                  <FiInfo className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                  <p>{steps[currentStep - 1].glossary}</p>
                </div>

                {/* Step controls */}
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-grotesk font-semibold text-text-muted hover:text-white disabled:opacity-40 disabled:hover:text-text-muted transition-all"
                  >
                    Back
                  </button>
                  <div className="flex gap-2">
                    {currentStep < steps.length ? (
                      <button
                        onClick={nextStep}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-background-primary text-xs font-grotesk font-bold hover:bg-primary/95 transition-all shadow-md"
                      >
                        <span>Next Step</span>
                        <FiArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        onClick={resetDemo}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-background-primary text-xs font-grotesk font-bold hover:bg-secondary/95 transition-all"
                      >
                        <span>Restart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoPanel;
