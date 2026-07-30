import React, { useState } from 'react';
import {
  Sparkles,
  BarChart2,
  Clock,
  Radio,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  TrendingUp,
  Award
} from 'lucide-react';

export const AiInsightsView: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState('Email & Slack');
  const [selectedAudience, setSelectedAudience] = useState('Executive Leadership');

  const qualityScore = 96.4;
  const readabilityScore = 88;
  const spamRiskScore = '0.2% (Low Risk)';
  const engagementPrediction = '94.8% (High Engagement)';
  const aiConfidenceScore = '98.5%';
  const bestTimeToSend = 'Tuesday at 09:30 AM EST';

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2.5 tracking-tight">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span>AI Communication Quality Insights & Scoring</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Predictive engagement modeling, spam risk scoring, readability metrics, and optimal dispatch recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold rounded-full flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quality Score: {qualityScore}% Executive Grade</span>
          </span>
        </div>
      </div>

      {/* 6 AI Telemetry Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Quality Score</span>
          <span className="text-base font-bold text-indigo-400">{qualityScore}%</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Readability Index</span>
          <span className="text-base font-bold text-cyan-400">{readabilityScore} / 100</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Spam Risk Score</span>
          <span className="text-xs font-bold text-emerald-400">{spamRiskScore}</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Engagement Predict</span>
          <span className="text-xs font-bold text-indigo-300">{engagementPrediction}</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">AI Confidence Score</span>
          <span className="text-base font-bold text-emerald-400">{aiConfidenceScore}</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Best Time to Send</span>
          <span className="text-[11px] font-bold font-mono text-amber-400">Tue 09:30 AM EST</span>
        </div>
      </div>

      {/* AI Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Channel & Audience */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-sky-400" />
            <span>Optimal Dispatch Channel & Audience</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Recommended Channel:</span>
              <span className="text-sky-400 font-bold">Email & Executive Slack</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Target Audience Profile:</span>
              <span className="text-indigo-400 font-bold">Executive Leadership (C-Suite)</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Recommended Tone:</span>
              <span className="text-emerald-400 font-bold">Executive Formal & Data-Driven</span>
            </div>
          </div>
        </div>

        {/* Translation & Quality Optimizations */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>AI Translation & Localization Suggestions</span>
          </h3>

          <div className="space-y-2 text-xs font-sans text-slate-300">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300">
              <strong className="block mb-1 text-purple-400">Multi-Language Suggestion:</strong>
              Localized versions ready in <strong>Spanish (LATAM)</strong>, <strong>Japanese (APAC)</strong>, and <strong>German (DACH)</strong>.
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300">
              <strong className="block mb-1 text-emerald-400">Compliance & Sensitivity Audit:</strong>
              100% compliant with corporate communication standards and PII data boundaries.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
