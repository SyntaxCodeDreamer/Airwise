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

// Mandatory Auth Gate Guard
const ProtectedAppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <LoginModal isOpen={true} onClose={() => {}} mandatory={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
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
      
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
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

