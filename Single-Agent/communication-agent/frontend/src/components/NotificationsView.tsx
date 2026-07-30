import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Radio,
  Sparkles,
  Clock,
  TrendingUp,
  Sliders,
  Check
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'Approved' | 'Rejected' | 'Scheduled' | 'Sent' | 'Failed' | 'Engagement' | 'Channel' | 'Template';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      type: 'Approved',
      title: 'Communication Approved',
      message: "'Q3 Executive Earnings Communication Dispatch' approved by Executive Director",
      timestamp: '10 mins ago',
      read: false
    },
    {
      id: 'n2',
      type: 'Engagement',
      title: 'High Engagement Detected',
      message: "'Global Product Update Newsletter' reached 98.4% open rate on Email channel",
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: 'n3',
      type: 'Scheduled',
      title: 'Communication Scheduled',
      message: "'System Maintenance Window Escalation' scheduled for dispatch at 02:00 UTC",
      timestamp: '3 hours ago',
      read: true
    },
    {
      id: 'n4',
      type: 'Failed',
      title: 'Delivery Failure Alert',
      message: 'Failed to deliver webhook payload to legacy Slack endpoint. Auto-retry in progress.',
      timestamp: '5 hours ago',
      read: true
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'Approved': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-rose-400" />;
      case 'Scheduled': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'Sent': return <CheckCircle2 className="w-5 h-5 text-sky-400" />;
      case 'Failed': case 'Channel': return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'Engagement': return <TrendingUp className="w-5 h-5 text-indigo-400" />;
      default: return <Bell className="w-5 h-5 text-sky-400" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread' && n.read) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2.5 tracking-tight">
            <Bell className="w-6 h-6 text-sky-400" />
            <span>Communication Event Notifications Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time notifications for approvals, rejections, delivery alerts, channel health drops, and engagement spikes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'all' ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Notifications ({notifications.length})
          </button>

          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'unread' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className={`glass-panel p-4 rounded-2xl border flex items-start space-x-3 transition ${
              n.read ? 'border-slate-800/80 bg-slate-950/40' : 'border-sky-500/30 bg-sky-500/5'
            }`}
          >
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
              {getNotificationIcon(n.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-100">{n.title}</h4>
                <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-sans">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
