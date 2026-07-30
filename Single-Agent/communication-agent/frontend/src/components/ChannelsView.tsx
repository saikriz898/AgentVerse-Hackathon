import React from 'react';
import { Radio, Mail, MessageSquare, ShieldCheck, Zap, CheckCircle2, Clock, Smartphone, FileSpreadsheet, Presentation } from 'lucide-react';
import { ChannelType } from '../types/communication';

interface ChannelStatusCard {
  name: ChannelType;
  status: 'Active' | 'Optimal' | 'Connected';
  delivery_speed: string;
  expected_response_rate: string;
  best_for_audience: string;
  icon: React.FC<any>;
}

const CHANNELS_LIST: ChannelStatusCard[] = [
  {
    name: "Email",
    status: "Active",
    delivery_speed: "< 2 seconds",
    expected_response_rate: "88%",
    best_for_audience: "CEO, Executive, Client, Investor",
    icon: Mail
  },
  {
    name: "Slack",
    status: "Optimal",
    delivery_speed: "< 500 ms",
    expected_response_rate: "96%",
    best_for_audience: "Developer, Designer, Admin, Support Team",
    icon: MessageSquare
  },
  {
    name: "Microsoft Teams",
    status: "Connected",
    delivery_speed: "< 800 ms",
    expected_response_rate: "94%",
    best_for_audience: "Developer, Manager, Internal Workforce",
    icon: MessageSquare
  },
  {
    name: "Google Chat",
    status: "Connected",
    delivery_speed: "< 600 ms",
    expected_response_rate: "91%",
    best_for_audience: "Engineering, Product Teams",
    icon: MessageSquare
  },
  {
    name: "WhatsApp",
    status: "Active",
    delivery_speed: "< 1 second",
    expected_response_rate: "98%",
    best_for_audience: "Urgent Alerts, External Stakeholders",
    icon: Smartphone
  },
  {
    name: "Telegram",
    status: "Connected",
    delivery_speed: "< 800 ms",
    expected_response_rate: "92%",
    best_for_audience: "Developer Broadcasts, Emergency Notices",
    icon: Smartphone
  },
  {
    name: "SMS",
    status: "Active",
    delivery_speed: "< 3 seconds",
    expected_response_rate: "99%",
    best_for_audience: "Critical Incident Alerts, Multi-Factor Urgent Notices",
    icon: Smartphone
  },
  {
    name: "Push Notification",
    status: "Optimal",
    delivery_speed: "< 200 ms",
    expected_response_rate: "95%",
    best_for_audience: "Mobile App Users, End Customers",
    icon: Zap
  },
  {
    name: "Dashboard Notification",
    status: "Active",
    delivery_speed: "Instant",
    expected_response_rate: "100%",
    best_for_audience: "Chief of Staff & LifeOS Command Center Users",
    icon: Radio
  },
  {
    name: "PDF",
    status: "Optimal",
    delivery_speed: "Generated Instantly",
    expected_response_rate: "90%",
    best_for_audience: "CEO, Board Members, Academic Professors",
    icon: FileSpreadsheet
  },
  {
    name: "Presentation",
    status: "Active",
    delivery_speed: "Generated Instantly",
    expected_response_rate: "92%",
    best_for_audience: "Executive Briefings, Keynote Summaries",
    icon: Presentation
  },
  {
    name: "Meeting Minutes",
    status: "Connected",
    delivery_speed: "Generated Instantly",
    expected_response_rate: "97%",
    best_for_audience: "Project Leads, Managers, Team Members",
    icon: FileSpreadsheet
  },
  {
    name: "Google Docs",
    status: "Connected",
    delivery_speed: "< 2 seconds",
    expected_response_rate: "89%",
    best_for_audience: "Researchers, Academic Collaborators",
    icon: FileSpreadsheet
  }
];

export const ChannelsView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Channel Integration & Recommendation Engine</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                13 Supported Channels
              </span>
            </h1>
            <p className="text-xs text-slate-400">Live delivery speed, success metrics, and audience matching per channel.</p>
          </div>
        </div>
      </div>

      {/* Grid of 13 Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CHANNELS_LIST.map((channel) => {
          const IconComponent = channel.icon;
          return (
            <div
              key={channel.name}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-sky-500/30 transition-all space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{channel.name}</h3>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      <span>{channel.status}</span>
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 text-xs font-mono border border-sky-500/20">
                  {channel.expected_response_rate} Response
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500 flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>Delivery Speed:</span>
                  </span>
                  <span className="font-semibold text-emerald-300 font-mono">{channel.delivery_speed}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-500 block mb-0.5">Optimal For Audience:</span>
                  <span className="font-semibold text-slate-200 block">{channel.best_for_audience}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
