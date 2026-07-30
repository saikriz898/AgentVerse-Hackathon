import React, { useEffect, useState } from 'react';
import { TemplateItem } from '../types/communication';
import { api } from '../services/api';
import { LayoutTemplate, FileText, CheckCircle2, Bookmark } from 'lucide-react';

export const PresetTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getTemplates()
      .then(setTemplates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-mono">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <LayoutTemplate className="h-5 w-5 text-sky-400" />
        <div>
          <h2 className="text-lg font-semibold text-white">Communication Structure Templates</h2>
          <p className="text-xs text-slate-400">Pre-built document layouts for LifeOS Multi-Agent outputs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div key={tpl.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base text-white">{tpl.name}</span>
                {tpl.is_preset && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-mono border border-sky-500/20">
                    Preset
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{tpl.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Document Format:</span>
                <span className="text-slate-200 font-medium">{tpl.output_type}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Target Audience:</span>
                <span className="text-slate-200 font-medium">{tpl.target_destination}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px] text-sky-300 overflow-x-auto max-h-28">
                <pre>{tpl.structure_template}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
