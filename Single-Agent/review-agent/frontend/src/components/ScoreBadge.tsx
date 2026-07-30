import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ScoreBadgeProps {
  score: number;
  status: 'approved' | 'rejected' | 'pending';
  showLabel?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, status, showLabel = true }) => {
  const isApproved = status === 'approved';

  let colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let badgeText = 'Approved';
  let Icon = CheckCircle2;

  if (!isApproved) {
    colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    badgeText = 'Rejected';
    Icon = XCircle;
  }

  // Tier color for score numeric pill
  let scoreBg = 'bg-emerald-500/20 text-emerald-300';
  if (score < 50) scoreBg = 'bg-rose-500/20 text-rose-300';
  else if (score < 70) scoreBg = 'bg-amber-500/20 text-amber-300';
  else if (score < 80) scoreBg = 'bg-yellow-500/20 text-yellow-300';

  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses}`}>
        <Icon className="w-3.5 h-3.5" />
        {showLabel && <span>{badgeText}</span>}
      </span>
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${scoreBg}`}>
        {score.toFixed(1)} / 100
      </span>
    </div>
  );
};
