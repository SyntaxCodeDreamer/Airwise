import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AIAdvisor from './pages/AIAdvisor';
import CommuteTransport from './pages/CommuteTransport';
import Community from './pages/Community';
import Profile from './pages/Profile';
import AdvancedSuite from './pages/AdvancedSuite';
import LoginModal from './components/LoginModal';

// Mandatory Auth & Family Onboarding Guard
const ProtectedAppContent = () => {
  const { isAuthenticated } = useAuth();

  // If user is not signed in, enforce the mandatory sign-in and family detail wizard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a12] p-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <LoginModal isOpen={true} onClose={() => {}} mandatory={true} />
      </div>
    );
  }

  // Once authenticated with family details, show the full AirWise AI suite
  return (
    <div className="min-h-screen flex flex-col bg-[#050a12] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ai-advisor" element={<AIAdvisor />} />
          <Route path="/suite" element={<AdvancedSuite />} />
          <Route path="/commute" element={<CommuteTransport />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      
      <footer className="border-t border-slate-800/60 bg-[#050a12]/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        AirWise AI • Breathe Smarter. Protect Your Family. Build a Cleaner Future.
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ProtectedAppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
