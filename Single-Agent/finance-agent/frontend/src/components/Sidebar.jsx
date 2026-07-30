import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  PieChart,
  Layers,
  Cloud,
  TrendingUp,
  LineChart,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  DollarSign
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'estimator', label: 'Project Cost Estimator', icon: Calculator, badge: 'AI' },
    { id: 'budget', label: 'Budget Planner', icon: PieChart },
    { id: 'breakdown', label: 'Cost Breakdown', icon: Layers },
    { id: 'infrastructure', label: 'Infrastructure Cost', icon: Cloud },
    { id: 'roi', label: 'ROI Analysis', icon: TrendingUp },
    { id: 'forecasting', label: 'Forecasting', icon: LineChart },
    { id: 'reports', label: 'Financial Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-900/95 border-r border-slate-800 backdrop-blur-md z-40 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
            <DollarSign className="w-6 h-6 stroke-[2.5]" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <h1 className="font-bold text-slate-100 text-base tracking-tight leading-none">FinanceAgent</h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">Enterprise AI</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}

              {item.badge && !collapsed && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-800 text-slate-100 text-xs rounded-md shadow-lg border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200">Financial Architect AI</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>System Operational</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
