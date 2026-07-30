import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DemoPanel from '../common/DemoPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-primary text-white relative">
      {/* Ambient glowing blobs specifically for dashboard */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full radial-glow-blue opacity-50 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-[20%] w-[40vw] h-[40vw] rounded-full radial-glow-purple opacity-40 pointer-events-none z-0" />

      {/* Desktop Sidebar (Left-anchored) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm"
            />
            
            {/* Sliding menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-64 bg-background-secondary border-r border-white/5 flex flex-col"
            >
              {/* Close Button Inside Drawer */}
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-all"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <Sidebar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Panel Content (Shifted right to make room for Sidebar) */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
        <Topbar onToggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6 sm:p-8 pt-20 sm:pt-24 overflow-y-auto">
          {/* Page Transition Wrapper */}
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Global Floating Demo Controller */}
        <DemoPanel />
      </div>
    </div>
  );
};

export default DashboardLayout;

