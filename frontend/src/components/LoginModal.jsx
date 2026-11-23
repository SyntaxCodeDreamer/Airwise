import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Wind, 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Baby, 
  HeartPulse, 
  Home, 
  Car, 
  Flame,
  ChevronRight
} from 'lucide-react';

const LoginModal = ({ isOpen, onClose, mandatory = true }) => {
  const { login, register, updateFamilyProfile } = useAuth();
  
  // Stages: 'auth' (step 1: signin/signup) -> 'family_onboarding' (step 2: family health context)
  const [step, setStep] = useState('auth');
  const [isRegister, setIsRegister] = useState(true); // default to register as new user
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  // Family Onboarding Details (Mandatory)
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'You', role: 'Adult', age: 32, respiratoryCondition: false },
    { id: 2, name: 'Riya', role: 'Child', age: 7, respiratoryCondition: false },
    { id: 3, name: 'Dadaji', role: 'Senior', age: 68, respiratoryCondition: true },
  ]);
  const [hasPregnantMember, setHasPregnantMember] = useState(false);
  const [hasIndoorAirPurifier, setHasIndoorAirPurifier] = useState(false);
  const [commuteMode, setCommuteMode] = useState('Public Transit / Metro');
  const [indoorSources, setIndoorSources] = useState(['Incense / Agarbatti']);

  if (!isOpen) return null;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }
    if (isRegister && !fullName) {
      setError('Please provide your full name.');
      return;
    }
    setError('');

    // Advance to mandatory step 2: Family details onboarding
    setStep('family_onboarding');
  };

  const handleFinalize = () => {
    // Persist user and family context
    const familyData = {
      hasElderly: familyMembers.some(m => m.role === 'Senior' || m.age >= 60),
      hasInfants: familyMembers.some(m => m.role === 'Child' || m.age <= 5),
      hasPregnantMember,
      hasAsthmaRespiratory: familyMembers.some(m => m.respiratoryCondition),
      hasIndoorAirPurifier,
      familyMembersCount: familyMembers.length,
      commuteMode,
      indoorPollutionSources: indoorSources,
      membersList: familyMembers
    };

    if (isRegister) {
      register(email, fullName, password);
    } else {
      login(email, fullName || email.split('@')[0], password);
    }

    if (updateFamilyProfile) {
      updateFamilyProfile(familyData);
    }

    if (onClose) onClose();
  };

  const handleDemoSignIn = () => {
    login('aarav.sharma@airwise.ai', 'Aarav Sharma', 'demo1234');
    if (onClose) onClose();
  };

  const toggleIndoorSource = (src) => {
    setIndoorSources(prev => 
      prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0c182c] border border-slate-700/80 rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Wind className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {step === 'auth' ? (isRegister ? 'Create Account' : 'Sign In to AirWise AI') : 'Family Health Context'}
              </h2>
              <p className="text-[11px] text-emerald-400 font-semibold tracking-wide">
                {step === 'auth' ? 'Step 1 of 2: Mandatory Credentials' : 'Step 2 of 2: Environmental Protection Profile'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-[10px] font-bold text-slate-400">
            <span className={step === 'auth' ? 'text-emerald-400' : 'text-slate-600'}>1</span>
            <span>•</span>
            <span className={step === 'family_onboarding' ? 'text-emerald-400' : 'text-slate-600'}>2</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* =========================================================================
            STEP 1: CREDENTIALS (SIGN IN / REGISTER)
           ========================================================================= */}
        {step === 'auth' && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#081220] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@airwise.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#081220] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#081220] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black rounded-xl text-xs tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
            >
              <span>Continue to Family Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-3 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
              >
                {isRegister ? 'Already have an account? Sign in here' : "Need an account? Sign up here"}
              </button>
            </div>

            {/* Quick 1-Click Demo Sign In */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-[11px] font-bold text-slate-300 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick 1-Click Sign In (Preconfigured Family)</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            STEP 2: MANDATORY FAMILY MEMBER DETAILS & HEALTH CONTEXT
           ========================================================================= */}
        {step === 'family_onboarding' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <p className="text-xs text-slate-300 leading-relaxed">
              Air pollution affects family members differently based on age and respiratory health. Please review your household members:
            </p>

            {/* Family Members Row from db.png */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Household Members
              </span>
              
              <div className="grid grid-cols-3 gap-2">
                {familyMembers.map((member, idx) => (
                  <div key={member.id} className="p-3 bg-[#081220] border border-slate-700/80 rounded-2xl text-center space-y-1">
                    <span className="text-2xl block">{member.role === 'Adult' ? '👨' : member.role === 'Child' ? '👧' : '👴'}</span>
                    <span className="text-xs font-bold text-white block leading-tight">{member.name}</span>
                    <span className="text-[10px] text-slate-400 block">{member.role} ({member.age}y)</span>
                    <span className={`text-[9px] font-semibold block px-1.5 py-0.5 rounded-full ${member.respiratoryCondition ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {member.respiratoryCondition ? 'Asthma/Respiratory' : 'Normal Lungs'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Vulnerability Checkboxes */}
            <div className="space-y-2.5 pt-2">
              <label className="flex items-center gap-3 p-2.5 bg-[#081220] border border-slate-700/70 rounded-xl cursor-pointer hover:border-slate-600 transition-all">
                <input
                  type="checkbox"
                  checked={hasPregnantMember}
                  onChange={(e) => setHasPregnantMember(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900 w-4 h-4"
                />
                <span className="text-xs text-slate-200 font-medium">Expectant Mother / Pregnancy in household</span>
              </label>

              <label className="flex items-center gap-3 p-2.5 bg-[#081220] border border-slate-700/70 rounded-xl cursor-pointer hover:border-slate-600 transition-all">
                <input
                  type="checkbox"
                  checked={hasIndoorAirPurifier}
                  onChange={(e) => setHasIndoorAirPurifier(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900 w-4 h-4"
                />
                <span className="text-xs text-slate-200 font-medium">Have HEPA Indoor Air Purifier at home</span>
              </label>
            </div>

            {/* Indoor Pollution Combustion Sources */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-1.5">Common Indoor Smoke Sources</span>
              <div className="flex flex-wrap gap-2">
                {['Incense / Agarbatti', 'Mosquito Coils', 'Kitchen Frying', 'Wood / Chulha'].map(src => {
                  const active = indoorSources.includes(src);
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => toggleIndoorSource(src)}
                      className={`text-[11px] px-3 py-1.5 rounded-xl border transition-all font-semibold ${
                        active 
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {src}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinalize}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl text-xs tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Details & Access Air Quality Dashboard</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginModal;
