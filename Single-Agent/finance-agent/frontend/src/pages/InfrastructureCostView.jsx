import React, { useState, useEffect } from 'react';
import { financeApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { Cloud, Check, Cpu, HardDrive, Network, Zap } from 'lucide-react';

export const InfrastructureCostView = ({ estimate, currency = 'USD' }) => {
  const [users, setUsers] = useState(estimate?.expected_users || 50000);
  const [storageGb, setStorageGb] = useState(Math.round((estimate?.expected_users || 50000) * 0.01));
  const [bandwidthGb, setBandwidthGb] = useState(Math.round((estimate?.expected_users || 50000) * 0.04));
  const [infraData, setInfraData] = useState(null);

  useEffect(() => {
    if (estimate) {
      const u = estimate.expected_users || 50000;
      setUsers(u);
      setStorageGb(Math.round(u * 0.01));
      setBandwidthGb(Math.round(u * 0.04));
    }
  }, [estimate]);

  const fetchComparison = async () => {
    try {
      const data = await financeApi.compareInfrastructure(users, storageGb, bandwidthGb);
      setInfraData(data);
    } catch (err) {
      console.error('Failed to compare infrastructure:', err);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [users, storageGb, bandwidthGb]);

  return (
    <div className="space-y-6">
      {/* Project Context Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-400">Infrastructure Target</span>
          <h2 className="text-base font-bold text-slate-100">{estimate?.project_name || 'Active Software Project'}</h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400">Estimated Annual Cloud Run-Rate</span>
          <div className="text-base font-bold text-emerald-400 font-mono">
            {formatCurrency(estimate?.infra_cost || 48000, currency)}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-400" />
              <span>Multi-Cloud Price Comparison & Resource Sizing Matrix</span>
            </h3>
            <p className="text-[11px] text-slate-400">Calibrated for {estimate?.project_name || 'your project'} workload requirements</p>
          </div>
          {infraData && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              Recommended: {infraData.recommended_provider}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> Active Monthly Users</span>
              <span className="text-emerald-400 font-mono font-bold">{users.toLocaleString()} Users</span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={users}
              onChange={(e) => setUsers(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-violet-400" /> Database & Blob Storage</span>
              <span className="text-emerald-400 font-mono font-bold">{storageGb} GB</span>
            </div>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={storageGb}
              onChange={(e) => setStorageGb(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5"><Network className="w-3.5 h-3.5 text-cyan-400" /> Egress CDN Bandwidth</span>
              <span className="text-emerald-400 font-mono font-bold">{bandwidthGb} GB</span>
            </div>
            <input
              type="range"
              min="200"
              max="20000"
              step="200"
              value={bandwidthGb}
              onChange={(e) => setBandwidthGb(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {infraData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infraData.providers.map((p, idx) => {
            const isRecommended = p.provider === infraData.recommended_provider;
            return (
              <div
                key={idx}
                className={`glass-panel p-6 rounded-2xl border transition-all relative space-y-4 flex flex-col justify-between ${
                  isRecommended
                    ? 'border-emerald-500/60 bg-emerald-950/20 shadow-xl shadow-emerald-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Best Value Stack
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold text-slate-100">{p.provider}</h4>
                  <p className="text-[11px] text-slate-400">{p.tier}</p>

                  <div className="my-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Estimated Cost</span>
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                      {formatCurrency(p.monthly_cost, currency)}<span className="text-xs text-slate-400 font-sans font-normal">/mo</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400">Compute Sizing</span>
                      <span className="font-medium text-slate-200">{p.compute}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400">Database Engine</span>
                      <span className="font-medium text-slate-200">{p.database}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400">Storage Allocated</span>
                      <span className="font-medium text-slate-200">{p.storage}</span>
                    </div>
                    <div className="flex justify-between pb-1.5">
                      <span className="text-slate-400">CDN Transfer</span>
                      <span className="font-medium text-slate-200">{p.cdn_bandwidth}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px]">
                  {(p.pros || []).map((pro, pidx) => (
                    <div key={pidx} className="flex items-center gap-1.5 text-emerald-400">
                      <Check className="w-3 h-3 shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
