import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AIAdvisor from './pages/AIAdvisor';
import CommuteTransport from './pages/CommuteTransport';
import Community from './pages/Community';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
          <Navbar />
          <main className="flex-1 pb-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ai-advisor" element={<AIAdvisor />} />
              <Route path="/commute" element={<CommuteTransport />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          
          <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
            AirWise AI • Breathe Smarter. Live Healthier. Build a Cleaner Future.
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

