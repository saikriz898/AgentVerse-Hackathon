import React, { useState, useEffect } from 'react';
import { Clock, Radio, CheckCircle2, ShieldCheck, Send, AlertTriangle, RefreshCw, Eye, CheckCheck, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

const SAMPLE_DELIVERIES = [
  {
    id: "del-001",
    title: "Executive Audit: Security & Subagent Latency Benchmark",
    source_agent: "Review Agent",
    document_type: "Executive Summary",
    channel: "Email",
    status: "Delivered",
    state: "Opened",
    recipient: "CEO",
    timestamp: "10 mins ago"
  },
  {
    id: "del-002",
    title: "Q3 Multi-Agent Milestone Release",
    source_agent: "Chief of Staff",
    document_type: "Stakeholder Update",
    channel: "PDF",
    status: "Scheduled",
    state: "Scheduled",
    recipient: "Executive Leadership",
    timestamp: "Scheduled for 10:00 AM"
  },
  {
    id: "del-003",
    title: "Parallel Execution Pipeline Status",
    source_agent: "Execution Agent",
    document_type: "Status Report",
    channel: "Slack",
    status: "Sent",
    state: "Read",
    recipient: "#dev-channel",
    timestamp: "1 hour ago"
  },
  {
    id: "del-004",
    title: "Gemini 2.5 Flash Latency Benchmark",
    source_agent: "Research Agent",
    document_type: "Presentation Summary",
    channel: "Microsoft Teams",
    status: "Queued",
    state: "Queued",
    recipient: "Research Team",
    timestamp: "Just now"
  }
];

export const DeliveryTrackingView: React.FC = () => {
  const [deliveries, setDeliveries] = useState<any[]>(SAMPLE_DELIVERIES);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await api.getDeliveryTracking();
      if (res.deliveries && res.deliveries.length > 0) {
        setDeliveries(res.deliveries);
      }
    } catch (e) {
      console.log("Using sample deliveries for live tracking demonstration.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = deliveries.filter(d => activeFilter === "All" || d.status === activeFilter || d.state === activeFilter);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Delivery Tracking & Live Chief of Staff Feed</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                8 Tracking States
              </span>
            </h1>
            <p className="text-xs text-slate-400">Track delivery lifecycle states: Queued, Scheduled, Sent, Delivered, Opened, Read, Failed, Retried.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchDeliveries}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "Queued", "Scheduled", "Sent", "Delivered", "Opened", "Read", "Failed", "Retried"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeFilter === f
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Live Timeline List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Radio className="h-4 w-4 text-sky-400 animate-pulse" />
          <span>Chief of Staff Delivery Execution Timeline</span>
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading delivery tracking feed...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No deliveries matching filter '{activeFilter}'.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5 font-mono">
                      <span>Source: {item.source_agent}</span>
                      <span>•</span>
                      <span>Channel: {item.channel || 'Email'}</span>
                      <span>•</span>
                      <span>Recipient: {item.recipient || 'Chief of Staff'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-xs font-mono border border-purple-500/20 flex items-center space-x-1">
                    <ShieldCheck className="h-3 w-3 text-purple-400" />
                    <span>Chief of Staff Synced</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    State: {item.state || item.status || 'Delivered'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
