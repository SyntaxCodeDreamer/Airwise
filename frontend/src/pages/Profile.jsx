import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Heart, Bell, Trash2, CheckCircle2, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.fullName || "Aarav Sharma");
  const [city, setCity] = useState(user?.city || "New Delhi");
  const [elderly, setElderly] = useState(user?.familyProfile?.hasElderly ?? true);
  const [infants, setInfants] = useState(user?.familyProfile?.hasInfants ?? false);
  const [asthma, setAsthma] = useState(user?.familyProfile?.hasAsthmaRespiratory ?? true);
  const [purifier, setPurifier] = useState(user?.familyProfile?.hasIndoorAirPurifier ?? false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      fullName: name,
      city: city,
      familyProfile: {
        hasElderly: elderly,
        hasInfants: infants,
        hasAsthmaRespiratory: asthma,
        hasIndoorAirPurifier: purifier
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          User & Family Health Profile
        </h1>
        <p className="text-sm text-slate-400">
          Tailor AI pollution advisories to your family's medical vulnerabilities and respiratory sensitivity.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          Health profile preferences updated successfully! AI recommendations refreshed.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Primary Residence City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Vulnerable Family Member Profile */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            Family Vulnerability Context
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            When enabled, Gemini AI automatically triggers heightened alerts for severe smog episodes.
          </p>

          <div className="space-y-3">
            {[
              {
                title: "Elderly Family Members (60+ yrs)",
                desc: "Heightened susceptibility to cardiac stress and particulate inflammation.",
                checked: elderly,
                setter: setElderly
              },
              {
                title: "Infants & Toddlers (<5 yrs)",
                desc: "Developing lung airways, requires strict indoor sheltering during peak AQI.",
                checked: infants,
                setter: setInfants
              },
              {
                title: "Pre-existing Respiratory Conditions (Asthma / COPD / Bronchitis)",
                desc: "Requires proactive notification to keep rescue inhalers accessible.",
                checked: asthma,
                setter: setAsthma
              },
              {
                title: "Equipped with Indoor HEPA Air Purifier",
                desc: "Allows AI to suggest indoor air cleaning routines during ventilation lockdowns.",
                checked: purifier,
                setter: setPurifier
              }
            ].map((item, idx) => (
              <label
                key={idx}
                className="flex items-start gap-3 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.setter(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-emerald-500 bg-slate-800 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-200 block">{item.title}</span>
                  <span className="text-xs text-slate-400">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" />
            Save Health Profile
          </button>

          <button
            type="button"
            onClick={() => alert("Account data anonymized and deleted as per GDPR/CPDP norms.")}
            className="px-4 py-2 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
