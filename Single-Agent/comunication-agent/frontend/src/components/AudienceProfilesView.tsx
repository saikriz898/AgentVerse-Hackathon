import React, { useState } from 'react';
import { Users, UserCheck, Search, ShieldCheck, Mail, Radio, FileText, ArrowRight } from 'lucide-react';
import { OutputDestination } from '../types/communication';

interface AudienceProfileCard {
  role: OutputDestination;
  category: string;
  complexity: string;
  technical_level: string;
  preferred_tone: string;
  preferred_format: string;
  preferred_channel: string;
  historical_success_rate: string;
}

const AUDIENCE_PROFILES: AudienceProfileCard[] = [
  {
    role: "CEO",
    category: "C-Suite Executive",
    complexity: "Low",
    technical_level: "Executive Summary Only",
    preferred_tone: "Executive",
    preferred_format: "Executive Summary / Single Page Brief",
    preferred_channel: "Email / PDF",
    historical_success_rate: "99.4%"
  },
  {
    role: "Executive",
    category: "Leadership",
    complexity: "Low-Medium",
    technical_level: "High Level Metrics",
    preferred_tone: "Executive",
    preferred_format: "Executive Summary",
    preferred_channel: "Email / PDF",
    historical_success_rate: "98.8%"
  },
  {
    role: "Manager",
    category: "Management",
    complexity: "Medium",
    technical_level: "Operational Metrics",
    preferred_tone: "Professional",
    preferred_format: "Status Report",
    preferred_channel: "Email / Slack",
    historical_success_rate: "97.5%"
  },
  {
    role: "Developer",
    category: "Engineering",
    complexity: "High",
    technical_level: "Full Code & Log Detail",
    preferred_tone: "Technical",
    preferred_format: "Markdown / Technical Documentation",
    preferred_channel: "Slack / Microsoft Teams",
    historical_success_rate: "99.1%"
  },
  {
    role: "Designer",
    category: "Product Design",
    complexity: "Medium",
    technical_level: "UI/UX & Workflow Context",
    preferred_tone: "Friendly",
    preferred_format: "Project Update",
    preferred_channel: "Slack",
    historical_success_rate: "96.2%"
  },
  {
    role: "Researcher",
    category: "R&D",
    complexity: "High",
    technical_level: "Academic & Benchmark Metrics",
    preferred_tone: "Academic",
    preferred_format: "Research Report",
    preferred_channel: "Google Docs / PDF",
    historical_success_rate: "98.0%"
  },
  {
    role: "Client",
    category: "External Stakeholder",
    complexity: "Medium",
    technical_level: "Business Value & Results",
    preferred_tone: "Formal",
    preferred_format: "Professional Email / PDF Report",
    preferred_channel: "Email",
    historical_success_rate: "99.0%"
  },
  {
    role: "Customer",
    category: "End User",
    complexity: "Low",
    technical_level: "Simple Steps",
    preferred_tone: "Simple",
    preferred_format: "Notification / Release Notes",
    preferred_channel: "Email / Push Notification",
    historical_success_rate: "95.8%"
  },
  {
    role: "Investor",
    category: "Financial Stakeholder",
    complexity: "Low-Medium",
    technical_level: "ROI & Strategic Milestones",
    preferred_tone: "Executive",
    preferred_format: "Stakeholder Update",
    preferred_channel: "Email / PDF",
    historical_success_rate: "98.5%"
  },
  {
    role: "Student",
    category: "Educational",
    complexity: "Low-Medium",
    technical_level: "Educational Guidance",
    preferred_tone: "Educational",
    preferred_format: "Daily Brief",
    preferred_channel: "Google Docs",
    historical_success_rate: "94.5%"
  },
  {
    role: "Professor",
    category: "Academic Reviewer",
    complexity: "High",
    technical_level: "Academic & Methodological",
    preferred_tone: "Academic",
    preferred_format: "Research Summary",
    preferred_channel: "Email / PDF",
    historical_success_rate: "97.2%"
  },
  {
    role: "Vendor",
    category: "External Partner",
    complexity: "Medium",
    technical_level: "Requirements & Deadlines",
    preferred_tone: "Formal",
    preferred_format: "Professional Email",
    preferred_channel: "Email",
    historical_success_rate: "96.9%"
  },
  {
    role: "Administrator",
    category: "System Admin",
    complexity: "High",
    technical_level: "Infrastructure & Permissions",
    preferred_tone: "Technical",
    preferred_format: "Incident Report",
    preferred_channel: "Slack / Microsoft Teams",
    historical_success_rate: "98.9%"
  },
  {
    role: "Support Team",
    category: "Operations",
    complexity: "Medium",
    technical_level: "Resolution Steps",
    preferred_tone: "Supportive",
    preferred_format: "Incident Report / Chat Message",
    preferred_channel: "Slack",
    historical_success_rate: "97.1%"
  },
  {
    role: "General Public",
    category: "Broad Audience",
    complexity: "Low",
    technical_level: "Non-Technical",
    preferred_tone: "Simple",
    preferred_format: "Announcement",
    preferred_channel: "Dashboard Notification / Email",
    historical_success_rate: "93.0%"
  },
  {
    role: "Employee",
    category: "Internal Workforce",
    complexity: "Low-Medium",
    technical_level: "Internal Policy & Updates",
    preferred_tone: "Friendly",
    preferred_format: "Weekly Brief",
    preferred_channel: "Slack / Email",
    historical_success_rate: "96.5%"
  }
];

export const AudienceProfilesView: React.FC = () => {
  const [search, setSearch] = useState<string>('');

  const filtered = AUDIENCE_PROFILES.filter(p => 
    p.role.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.preferred_tone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Enterprise Audience Profiles Engine</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                16 Categories
              </span>
            </h1>
            <p className="text-xs text-slate-400">Context-aware technical depth, tone rules, and channel guidelines per audience role.</p>
          </div>
        </div>

        <div className="relative">
          <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search audience roles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none w-56"
          />
        </div>
      </div>

      {/* Grid of 16 Audience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((profile) => (
          <div
            key={profile.role}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-sky-500/30 transition-all space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                    {profile.role.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{profile.role}</h3>
                    <span className="text-[10px] text-slate-400 block font-mono">{profile.category}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/20 flex items-center space-x-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>{profile.historical_success_rate} Success</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Technical Depth:</span>
                  <span className="font-semibold text-slate-200">{profile.technical_level}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Preferred Tone:</span>
                  <span className="font-semibold text-indigo-300">{profile.preferred_tone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Preferred Format:</span>
                  <span className="font-semibold text-sky-300">{profile.preferred_format}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Delivery Channels:</span>
                  <span className="font-semibold text-amber-300">{profile.preferred_channel}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 text-right">
              <span className="text-[11px] text-sky-400 font-mono inline-flex items-center space-x-1">
                <span>Auto-Applied in AI Studio</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
