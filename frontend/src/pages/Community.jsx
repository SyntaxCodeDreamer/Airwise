import React, { useState, useEffect } from 'react';
import { communityApi } from '../services/api';
import { Users, AlertTriangle, ThumbsUp, Send, CheckCircle2, MapPin } from 'lucide-react';

const Community = () => {
  const [reports, setReports] = useState([]);
  const [incidentType, setIncidentType] = useState("GARBAGE_BURNING");
  const [description, setDescription] = useState("");
  const [landmark, setLandmark] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadReports = async () => {
    try {
      const data = await communityApi.getReports();
      setReports(data || []);
    } catch (e) {
      console.error("Failed to load reports:", e);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) return;
    setLoading(true);
    try {
      await communityApi.submitReport({
        incident_type: incidentType,
        description: description,
        landmark: landmark || "Local Area",
        latitude: 28.6508,
        longitude: 77.3152
      });
      setDescription("");
      setLandmark("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      loadReports();
    } catch (e) {
      console.error("Report submit failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await communityApi.upvoteReport(id);
      loadReports();
    } catch (e) {
      console.error("Upvote failed:", e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Users className="w-3.5 h-3.5" />
          Citizen Environmental Action
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Community Pollution Watch & Incident Reporting
        </h1>
        <p className="text-sm text-slate-400">
          Crowdsourced reporting of illegal garbage burning, industrial plumes, and construction dust hotspots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Incident Submission Form */}
        <div className="lg:col-span-5">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl sticky top-24">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Report Local Pollution Incident
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Reports alert nearby citizens and help local civil authorities pinpoint illegal smog triggers.
            </p>

            {submitted && (
              <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                Report logged successfully! Fellow citizens can now verify.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Incident Type
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs md:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="GARBAGE_BURNING">Open Waste / Plastic Burning</option>
                  <option value="STUBBLE_BURNING">Crop Residue / Stubble Burning</option>
                  <option value="DUST_CONSTRUCTION">Uncovered Construction Dust Plume</option>
                  <option value="INDUSTRIAL_SMOKE">Heavy Industrial Chimney Discharge</option>
                  <option value="VEHICULAR_SMARL">High Density Idling / Congestion Smog</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Landmark / Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Anand Vihar Metro Station Gate 2"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs md:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Incident Details & Severity
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe smoke color, burning materials, or visible respiratory hazard..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs md:text-sm rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !description}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Broadcast Alert'}
              </button>
            </form>
          </div>
        </div>

        {/* Live Incident Feed */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Live Citizen Pollution Alerts ({reports.length})
          </h2>

          <div className="space-y-4">
            {reports.map((rep) => (
              <div 
                key={rep.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase">
                      {rep.incident_type.replace(/_/g, ' ')}
                    </span>
                    {rep.status === 'VERIFIED' && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {rep.created_at?.slice(0, 10)}
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {rep.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-700/40 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{rep.landmark}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>Reported by: <strong className="text-slate-300">{rep.user_name}</strong></span>
                    <button
                      onClick={() => handleUpvote(rep.id)}
                      className="flex items-center gap-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-600/50 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{rep.upvotes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;

