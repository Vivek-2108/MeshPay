import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiDollarSign, FiBox, FiGlobe, FiTrendingUp, FiSettings, FiLogOut, FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Users', path: '/simulator?tab=users', icon: FiUsers },
    { name: 'Payments', path: '/simulator?tab=payments', icon: FiDollarSign },
    { name: 'Packets', path: '/simulator?tab=packets', icon: FiBox },
    { name: 'Network', path: '/simulator?tab=network', icon: FiGlobe },
    { name: 'Analytics', path: '/analytics', icon: FiTrendingUp },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];


  return (
    <aside className="w-64 bg-background-secondary border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center border border-white/10">
            <FiActivity className="h-4 w-4 text-background-primary animate-pulse" />
          </div>
          <span className="font-orbitron font-black text-lg tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            MESHPAY
          </span>
        </Link>
      </div>

      {/* Profile summary in Sidebar */}
      {user && (
        <div className="p-6 border-b border-white/5 bg-[#111111]/20 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-accent/20 to-primary/20 border border-white/10 flex items-center justify-center text-primary font-grotesk font-black text-sm uppercase">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-grotesk font-bold text-sm text-white truncate">{user.name}</h4>
            <p className="font-mono text-[10px] text-secondary truncate">{user.vpa}</p>
          </div>
        </div>
      )}

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const itemPath = item.path.split('?')[0];
          const itemSearch = item.path.split('?')[1] || '';
          const currentSearch = location.search.replace(/^\?/, '');
          
          const isPathActive = location.pathname === itemPath;
          const isSearchActive = itemSearch === currentSearch || (itemSearch === 'tab=users' && currentSearch === '');
          const isActive = isPathActive && (location.pathname !== '/simulator' || isSearchActive);
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-grotesk font-semibold transition-all duration-300 group
                ${isActive ? 'text-primary' : 'text-text-muted hover:text-white hover:bg-white/5'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon className={`h-4.5 w-4.5 transition-colors duration-300 relative z-10 ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-white'}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-grotesk font-semibold text-danger hover:bg-danger/5 border border-transparent hover:border-danger/10 transition-all duration-300"
        >
          <FiLogOut className="h-4.5 w-4.5" />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
