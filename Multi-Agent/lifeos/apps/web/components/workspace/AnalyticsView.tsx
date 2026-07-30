'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Activity,
  Cpu,
  Database,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-none">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="flex items-center gap-1.5">
              <BarChart3 className="h-3 w-3 stroke-[2]" /> Executive Intelligence
            </Badge>
            <Badge variant="outline">Real-Time Metrics</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            System Analytics & Operational Velocity
          </h1>
          <p className="text-sm text-text-secondary">
            Real-time analytics for AIDLC execution velocity, token usage, infrastructure costs, and QA gate success.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4 stroke-[1.75]" /> Last 30 Days
          </Button>
          <Button variant="primary" size="sm">
            <Download className="mr-2 h-4 w-4 stroke-[2]" /> Export Intelligence
          </Button>
        </div>
      </div>

      {/* Top 4 Intelligence KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Sprint Velocity</span>
          <p className="mt-1.5 text-2xl font-bold text-text-primary">94.2 pts</p>
          <span className="text-[12px] text-emerald-500 font-semibold">+18.4% vs Last Month</span>
        </Card>
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Token Consumption</span>
          <p className="mt-1.5 text-2xl font-bold text-text-primary">1.42M Tokens</p>
          <span className="text-[12px] text-text-secondary">Avg 24k tokens/turn</span>
        </Card>
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Infrastructure Cost</span>
          <p className="mt-1.5 text-2xl font-bold text-text-primary">$124.00/mo</p>
          <span className="text-[12px] text-emerald-500 font-semibold">+24% ROI Savings</span>
        </Card>
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">QA Pass Threshold</span>
          <p className="mt-1.5 text-2xl font-bold text-emerald-500">96.8/100</p>
          <span className="text-[12px] text-text-secondary">Passed Gate Score &ge; 80</span>
        </Card>
      </div>

      {/* Performance Trends Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Metric Card 1: Execution Latency */}
        <Card className="bg-surface-1 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Department Execution Latency</h3>
              <p className="text-[11px] text-text-muted">Average execution duration by SDLC module</p>
            </div>
            <Badge variant="accent">Avg 1.4s</Badge>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { dept: 'Business Analysis', duration: '0.42s', pct: 30 },
              { dept: 'Product Planning', duration: '1.18s', pct: 60 },
              { dept: 'System Architecture', duration: '1.42s', pct: 75 },
              { dept: 'Software Engineering', duration: '2.15s', pct: 95 },
              { dept: 'Quality Assurance Gate', duration: '0.78s', pct: 40 },
              { dept: 'DevOps & Deployment', duration: '0.62s', pct: 35 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span className="font-semibold">{item.dept}</span>
                  <span className="font-mono text-text-muted">{item.duration}</span>
                </div>
                <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-primary rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Metric Card 2: Cloud Infrastructure Comparison */}
        <Card className="bg-surface-1 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Multi-Cloud Tariff Intelligence</h3>
              <p className="text-[11px] text-text-muted">Finance Department monthly pricing breakdown</p>
            </div>
            <Badge variant="success">AWS Spot Selected</Badge>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { provider: 'AWS EC2 Spot Instances', cost: '$124.00/mo', isSelected: true },
              { provider: 'GCP Cloud Run Microservice', cost: '$148.00/mo', isSelected: false },
              { provider: 'Azure App Service Plan', cost: '$165.00/mo', isSelected: false },
              { provider: 'DigitalOcean Kubernetes Cluster', cost: '$180.00/mo', isSelected: false },
              { provider: 'Vercel Enterprise Serverless', cost: '$210.00/mo', isSelected: false },
            ].map((cloud, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-luxury ${
                  cloud.isSelected
                    ? 'border-emerald-500/40 bg-emerald-500/10 font-bold text-text-primary'
                    : 'border-border/60 bg-surface-2/40 text-text-secondary'
                }`}
              >
                <span>{cloud.provider}</span>
                <span className="font-mono">{cloud.cost}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
