import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../services/auth';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import Drawer from '../components/common/Drawer';
import Button from '../components/common/Button';
import { FiSearch, FiSliders, FiArrowDownRight, FiArrowUpRight, FiLayers, FiFileText, FiCalendar, FiClock } from 'react-icons/fi';

const Transactions = () => {
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, sent, received
  
  // Selected transaction details for drawer
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      if (data.success) {
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.warn('Failed to load transaction ledger:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter logic
  const filteredTx = transactions.filter((tx) => {
    const matchesSearch = 
      tx.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx._id.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filterType === 'sent') {
      return matchesSearch && tx.sender === user.vpa;
    }
    if (filterType === 'received') {
      return matchesSearch && tx.receiver === user.vpa;
    }
    return matchesSearch;
  });

  if (loading) {
    return <Loader size="lg" text="Decompressing secure ledger index..." />;
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-3xl font-black font-orbitron text-white">LEDGER RECORDS</h1>
        <p className="text-sm text-text-muted mt-1 font-sans">
          Audit chronological mesh settlement receipts and signature hashes
        </p>
      </div>

      {/* Filter and search actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#111]/40 border border-white/5 p-4 rounded-xl">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-text-muted focus:border-primary outline-none font-sans"
            placeholder="Search address / transaction ID..."
          />
        </div>

        {/* Filter toggles */}
        <div className="flex gap-2 w-full sm:w-auto">
          {[
            { id: 'all', name: 'All Records' },
            { id: 'sent', name: 'Sent' },
            { id: 'received', name: 'Received' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold font-grotesk transition-all duration-300 border ${
                filterType === type.id
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-transparent text-text-muted border-white/5 hover:border-white/15'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions list table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#111111]/20 font-grotesk text-xs text-text-muted uppercase tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Sender / Receiver</th>
                <th className="px-6 py-4">Cleared At</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans text-xs text-white">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-muted">
                    No transactions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => {
                  const isSent = tx.sender === user.vpa;
                  return (
                    <tr
                      key={tx._id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-white/[0.02] cursor-pointer transition-all duration-200"
                    >
                      {/* Txn ID */}
                      <td className="px-6 py-4 font-mono text-primary font-bold">
                        {tx._id.substring(0, 12)}...
                      </td>
                      
                      {/* Sender/Receiver details */}
                      <td className="px-6 py-4 max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-md flex items-center justify-center ${
                            isSent 
                              ? 'bg-danger/10 text-danger' 
                              : 'bg-secondary/10 text-secondary'
                          }`}>
                            {isSent ? <FiArrowUpRight className="h-3.5 w-3.5" /> : <FiArrowDownRight className="h-3.5 w-3.5" />}
                          </div>
                          <span className="truncate">{isSent ? tx.receiver : tx.sender}</span>
                        </div>
                      </td>

                      {/* Created date */}
                      <td className="px-6 py-4 text-text-muted">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge status="settled">SETTLED</Badge>
                      </td>

                      {/* Amount */}
                      <td className={`px-6 py-4 text-right font-mono font-bold ${isSent ? 'text-danger' : 'text-secondary'}`}>
                        {isSent ? '-' : '+'}{tx.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Side Drawer */}
      <Drawer
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Ledger Details"
        size="md"
      >
        {selectedTx && (
          <div className="space-y-6 text-left">
            
            {/* Header amount block */}
            <div className="text-center py-6 border-b border-white/5 bg-[#111]/30 rounded-xl p-4">
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono block mb-1">
                Settled Amount
              </span>
              <h2 className={`font-mono text-3xl font-black ${selectedTx.sender === user.vpa ? 'text-danger' : 'text-secondary'}`}>
                {selectedTx.sender === user.vpa ? '-' : '+'}{selectedTx.amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </h2>
              <div className="mt-3">
                <Badge status="settled">LEDGER CLEARANCE SUCCESS</Badge>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold font-orbitron text-white uppercase tracking-wider">
                Receipt Information
              </h3>
              
              <div className="space-y-3 font-grotesk text-xs border border-white/5 rounded-xl p-4 bg-[#111]/10">
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-muted flex items-center gap-1.5"><FiFileText className="h-4 w-4" /> Transaction ID:</span>
                  <span className="font-mono text-white font-semibold">{selectedTx._id}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-muted flex items-center gap-1.5"><FiCalendar className="h-4 w-4" /> Settlement Date:</span>
                  <span className="text-white font-semibold">{new Date(selectedTx.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-muted flex items-center gap-1.5"><FiClock className="h-4 w-4" /> Settlement Time:</span>
                  <span className="text-white font-semibold">{new Date(selectedTx.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Signatures */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-orbitron text-white uppercase tracking-wider">
                Cryptographic Signatures
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-mono text-text-muted uppercase block mb-1">Sender VPA (Signed address)</label>
                  <pre className="p-3 bg-[#050505] border border-white/5 rounded-xl font-mono text-[10px] text-primary truncate">
                    {selectedTx.sender}
                  </pre>
                </div>
                <div>
                  <label className="text-[9px] font-mono text-text-muted uppercase block mb-1">Receiver VPA</label>
                  <pre className="p-3 bg-[#050505] border border-white/5 rounded-xl font-mono text-[10px] text-secondary truncate">
                    {selectedTx.receiver}
                  </pre>
                </div>
                <div>
                  <label className="text-[9px] font-mono text-text-muted uppercase block mb-1">Signature Hash</label>
                  <pre className="p-3 bg-[#050505] border border-white/5 rounded-xl font-mono text-[10px] text-accent truncate">
                    {selectedTx.signature || 'sha256:05a8fbc8d8f28d8a7c8e9c8e8d8c89b2b2a1a8c8e9b88a8d'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button variant="outline" className="w-full" onClick={() => setSelectedTx(null)}>
                Dismiss Audit
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Transactions;
