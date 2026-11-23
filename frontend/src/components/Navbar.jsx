import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { 
  Home, 
  Map, 
  Brain, 
  Calendar, 
  Wind, 
  Car, 
  Users, 
  Bell, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

import leafLogo from '../assets/airwise_leaf_logo.png';
import avatarYou from '../assets/avatar_you.png';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/suite', label: 'Map', icon: Map },
    { to: '/ai-advisor', label: 'AI Advisor', icon: Brain },
    { to: '/suite', label: 'Planner', icon: Calendar },
    { to: '/suite', label: 'Indoor Air', icon: Wind },
    { to: '/commute', label: 'Transport', icon: Car },
    { to: '/community', label: 'Community', icon: Users },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 lg:px-8 py-3 bg-[#060e1c]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline exactly as in db.png */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl">
              <img src={leafLogo} alt="AirWise AI" className="h-9 object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center">
                AirWise <span className="text-cyan-400 ml-1">AI</span>
              </div>
              <span className="text-[11px] block font-medium text-slate-300 -mt-0.5 tracking-tight">
                Breathe Smarter. Live Healthier.
              </span>
            </div>
          </NavLink>

          {/* Centered Futuristic Pill Navigation from db.png */}
          <nav className="hidden lg:flex items-center bg-[#0a1628]/90 border border-slate-700/60 rounded-full px-2 py-1.5 shadow-xl shadow-black/40">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Header Controls: Notification Bell, Profile Avatar, Slogan */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden xl:block text-right pr-1">
              <span className="text-xs font-bold text-slate-200 block leading-tight">Smarter Choices.</span>
              <span className="text-xs font-bold text-slate-300 block leading-tight">Cleaner Tomorrow.</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-all relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-[#0e172a] border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Live Environmental Alerts
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">1 New</span>
                  </div>
                  <div className="py-3 text-xs text-slate-300">
                    <p className="font-semibold text-white">Evening Inversion Warning</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">PM2.5 spike predicted from 6 PM - 10 PM. Run indoor purifiers and seal windows.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Profile from db.png */}
            <NavLink
              to="/profile"
              className="w-9 h-9 rounded-full overflow-hidden border border-slate-600 hover:border-emerald-400 transition-all shadow-md block shrink-0"
              title="Family Profile"
            >
              <img src={avatarYou} alt="Profile" className="w-full h-full object-cover" />
            </NavLink>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around overflow-x-auto gap-2 pt-2.5 border-t border-slate-800/60 mt-2">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center py-1 px-2 text-[10px] font-semibold whitespace-nowrap transition-colors ${
                    isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        mandatory={false}
      />
    </>
  );
};

export default Navbar;
