'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPopover({ isOpen, onClose }: NotificationPopoverProps) {
  const [notifications, setNotifications] = useState([
    { id: 'n-1', title: 'Background Embedding Job Completed', message: '768d vector batch stored for Development Workspace', module: 'Embedding Worker', isRead: false, time: '10m ago' },
    { id: 'n-2', title: 'Relationship Topology Refreshed', message: 'Force-directed graph layout re-calculated', module: 'Graph Engine', isRead: false, time: '25m ago' },
    { id: 'n-3', title: 'Trash Vault Purge Performed', message: 'Soft-deleted entries permanently purged by Administrator', module: 'Trash Vault', isRead: true, time: '1h ago' },
    { id: 'n-4', title: 'Hybrid Search Index Merged', message: 'pgvector + Full-text RRF updated', module: 'Search Index', isRead: true, time: '2h ago' },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="notification-popover-root">
          <div key="notification-backdrop" className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            key="notification-[#E5E7EB] modal-body"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#141519] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl shadow-2xl z-50 overflow-hidden font-sans text-xs select-none"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-[#E5E7EB] dark:border-white/[0.06] flex items-center justify-between bg-[#F9FAFB] dark:bg-[#111115]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#2563EB]" />
                <span className="font-bold text-[#111827] dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#2563EB] text-white text-[10px] font-bold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 hover:underline"
              >
                Mark all read
              </button>
            </div>

            {/* Notifications List Stream */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB] dark:divide-white/[0.04]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#6B7280] dark:text-neutral-400 font-mono">
                  No notifications
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 transition-colors flex items-start justify-between gap-3 ${
                      !item.isRead ? 'bg-[#2563EB]/5 dark:bg-[#2563EB]/10' : 'hover:bg-[#F9FAFB] dark:hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111827] dark:text-white truncate">{item.title}</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                          {item.module}
                        </span>
                      </div>
                      <p className="text-[#6B7280] dark:text-neutral-400 leading-snug">{item.message}</p>
                      <span className="text-[10px] text-gray-500 font-mono block">{item.time}</span>
                    </div>

                    <button
                      onClick={() => clearNotification(item.id)}
                      title="Dismiss notification"
                      className="text-gray-400 hover:text-rose-500 p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[#E5E7EB] dark:border-white/[0.06] bg-[#F9FAFB] dark:bg-[#111115] flex items-center justify-between text-xs">
              <Link
                href="/workspace"
                onClick={onClose}
                className="w-full text-center py-1.5 font-bold text-[#2563EB] dark:text-blue-400 hover:underline flex items-center justify-center gap-1.5"
              >
                <span>View Workspace Notification Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
