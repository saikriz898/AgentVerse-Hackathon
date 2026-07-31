'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Layers,
  Database,
  FileCode,
  CheckCircle2,
  X,
  Plus,
  Zap,
  Sparkles,
  Sliders,
  Check,
  Cpu,
} from 'lucide-react';

export interface ContextBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyContext: (contextBlock: string) => void;
}

export const ContextBuilderModal: React.FC<ContextBuilderModalProps> = ({
  isOpen,
  onClose,
  onApplyContext,
}) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([
    '18-Stage AIDLC Orchestrator Engine',
    'AI Workspace State Manager',
  ]);

  const [selectedMemories, setSelectedMemories] = useState<string[]>([
    'lifeos_architecture_spec',
    'qa_security_gate_threshold',
  ]);

  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([
    'Latency Target < 150ms',
    'OWASP Security Score >= 80',
    'Neon pgvector 768-Dim RRF Memory Synced',
  ]);

  if (!isOpen) return null;

  const handleToggleModule = (mod: string) => {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleToggleMemory = (mem: string) => {
    setSelectedMemories((prev) =>
      prev.includes(mem) ? prev.filter((m) => m !== mem) : [...prev, mem]
    );
  };

  const handleToggleConstraint = (c: string) => {
    setSelectedConstraints((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const handleApply = () => {
    const contextBlock = `[STRUCTURED SYSTEM CONTEXT]
Attached Active System Modules:
${selectedModules.map((m) => `- Module: ${m}`).join('\n')}

Active Vector RRF Memory Entries:
${selectedMemories.map((m) => `- Memory Key: ${m}`).join('\n')}

Technical & Business Constraints:
${selectedConstraints.map((c) => `- Constraint: ${c}`).join('\n')}`;

    onApplyContext(contextBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-surface-1 border border-border/80 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-light text-accent-primary font-bold">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Multi-Agent Context Builder</h2>
              <p className="text-xs text-text-secondary">Attach active system modules, vector memory keys, and technical constraints into prompt context.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs max-h-[60vh] overflow-y-auto pr-1">
          {/* Section 1: Active System Modules */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-accent-primary" /> Select Active System Context Modules ({selectedModules.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                '18-Stage AIDLC Orchestrator Engine',
                'AI Workspace State Manager',
                'Master Express REST Gateway',
                'Microservice Fleet API Client',
                'Prompt Optimizer & Gap Analysis Service',
              ].map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => handleToggleModule(mod)}
                  className={`p-2.5 rounded-xl border text-left transition-luxury flex items-center justify-between ${
                    selectedModules.includes(mod)
                      ? 'bg-accent-light border-accent-primary text-accent-primary font-semibold'
                      : 'bg-surface-2 border-border/60 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="truncate text-[11px]">{mod}</span>
                  {selectedModules.includes(mod) && <Check className="h-3.5 w-3.5 shrink-0 text-accent-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Vector RRF Memory Keys */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-indigo-400" /> Select Vector RRF Memory Keys ({selectedMemories.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'lifeos_architecture_spec',
                'qa_security_gate_threshold',
                'neon_pgvector_rrf_schema',
                'chief_of_staff_persona_rules',
              ].map((mem) => (
                <button
                  key={mem}
                  type="button"
                  onClick={() => handleToggleMemory(mem)}
                  className={`p-2.5 rounded-xl border text-left font-mono transition-luxury flex items-center justify-between ${
                    selectedMemories.includes(mem)
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-semibold'
                      : 'bg-surface-2 border-border/60 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="truncate text-[11px]">{mem}</span>
                  {selectedMemories.includes(mem) && <Check className="h-3.5 w-3.5 shrink-0 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Technical Constraints */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-400" /> Active Technical Constraints ({selectedConstraints.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'Latency Target < 150ms',
                'OWASP Security Score >= 80',
                'Neon pgvector 768-Dim RRF Memory Synced',
                'OpenAPI v3 Contract Verified',
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleToggleConstraint(c)}
                  className={`p-2.5 rounded-xl border text-left font-mono transition-luxury flex items-center justify-between ${
                    selectedConstraints.includes(c)
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
                      : 'bg-surface-2 border-border/60 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="truncate text-[11px]">{c}</span>
                  {selectedConstraints.includes(c) && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-text-muted font-mono">Total Context Package: {selectedModules.length + selectedMemories.length + selectedConstraints.length} Items</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Attach Context to Prompt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
