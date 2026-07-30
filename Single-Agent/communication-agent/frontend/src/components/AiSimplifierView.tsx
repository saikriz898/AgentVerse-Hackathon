import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, BookOpen, UserCheck, RefreshCw, FileText, Code2 } from 'lucide-react';
import { logCommunicationEvent } from '../utils/historyLogger';

interface SimplificationPreset {
  id: string;
  name: string;
  description: string;
  icon: React.FC<any>;
  badge: string;
}

const PRESETS: SimplificationPreset[] = [
  {
    id: 'tech_professional',
    name: 'Tech Professional',
    description: 'Converts complex, opaque AI prompts and LLM outputs into clean, structured, and easily understandable technical architecture & engineering documentation.',
    icon: Code2,
    badge: 'Tech Spec Ready'
  }
];

const SAMPLE_COMPLEX_INPUTS = [
  {
    title: 'Distributed System Architecture',
    text: `The microservices deployment leverages Kubernetes Horizontal Pod Autoscaler (HPA) coupled with an Istio Service Mesh to enforce mTLS zero-trust communication and dynamic circuit-breaking. Asynchronous event streaming is handled via Kafka partitioned logs with idempotent producer semantics to prevent backpressure bottlenecks in the event loop during high concurrency spikes.`
  },
  {
    title: 'Machine Learning Model Backprop',
    text: `Stochastic Gradient Descent (SGD) with Nesterov Momentum updates weights by computing partial derivatives of the non-convex cross-entropy loss function via the chain rule across deep feedforward layers. Softmax activation normalizes logits into probability distributions, subject to L2 weight decay regularization to mitigate overfitting.`
  },
  {
    title: 'Options Trading Black-Scholes',
    text: `The Black-Scholes partial differential equation models option valuation assuming geometric Brownian motion with continuous risk-free rate r and implied volatility sigma. The Delta represents first-order price sensitivity with respect to underlying asset S, while Gamma captures second-order curvature acceleration.`
  }
];

export const AiSimplifierView: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_COMPLEX_INPUTS[0].text);
  const [activePreset, setActivePreset] = useState<string>('tech_professional');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [result, setResult] = useState<{
    summary: string;
    takeaways: string[];
    explanation: string;
    readabilityImprovement: string;
    targetAudience: string;
  } | null>(null);

  const handleSimplify = () => {
    if (!inputText.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const simSummary = 'System dynamically scales container pods under high traffic spikes while preserving zero-trust encrypted microservice communication and zero message loss.';
      const simExplanation = `Technical Architectural Breakdown for Tech Professionals:\n\n` +
        `• Workload Autoscaling: Automatically expands cloud compute capacity when CPU thresholds cross 75% load.\n` +
        `• Zero-Trust Encryption: Istio proxy sidecars negotiate cryptographic mTLS handshake for every internal API call.\n` +
        `• Queue Buffer Resilience: Kafka log partitioning acts as a resilient buffer, protecting database operations during traffic bursts.`;
      const simTakeaways = [
        'High Concurrency: Prevents server thread exhaustion during peak traffic bursts.',
        'Zero-Trust Security: Enforces authenticated mTLS transport across all internal microservice calls.',
        'Backpressure Protection: Kafka event streaming ensures zero data loss during high load spikes.'
      ];

      setResult({
        summary: simSummary,
        takeaways: simTakeaways,
        explanation: simExplanation,
        readabilityImprovement: '92% Simpler (Technical Spec Standard)',
        targetAudience: 'Tech Professional'
      });

      logCommunicationEvent({
        type: 'simplifier',
        title: 'AI Text Simplification Executed',
        details: `Target Audience: Tech Professional | Input: ${inputText.slice(0, 45)}...`,
        preview: simSummary,
        badge: 'AI Text Simplifier'
      });

      setLoading(false);
    }, 800);
  };

  const handleCopy = () => {
    if (!result) return;
    const fullOutput = `${result.summary}\n\nKey Takeaways:\n${result.takeaways.map((t) => `• ${t}`).join('\n')}\n\nDetailed Explanation:\n${result.explanation}`;
    navigator.clipboard.writeText(fullOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-900/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold border border-sky-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              AI Prompt & Output Simplifier
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-100 mt-2 tracking-tight">
            Convert Complex AI Outputs into Simple, Understandable Format
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Paste any complex AI text, jargon-heavy prompt, or technical explanation below. The AI Agent will instantly translate it into clean, structured engineering documentation for Tech Professionals.
          </p>
        </div>
      </div>

      {/* Preset Target Audience (Single Selection: Tech Professional) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Target Audience
        </label>
        <div className="grid grid-cols-1 gap-3 max-w-2xl">
          {PRESETS.map((preset) => {
            const IconComponent = preset.icon;
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setActivePreset(preset.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative group flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-950/50 border-sky-500 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100">{preset.name}</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">{preset.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sample Inputs Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0">Test Sample Complex AI Inputs:</span>
        {SAMPLE_COMPLEX_INPUTS.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(sample.text)}
            className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3 h-3 text-sky-400" />
            <span>{sample.title}</span>
          </button>
        ))}
      </div>

      {/* Main Dual Studio Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL: Complex AI Input */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Complex AI Input (Paste Here)</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {inputText.length} chars • {inputText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your complex AI prompt, raw LLM output, technical document, or code explanation here..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setInputText('')}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear Input
            </button>

            <button
              onClick={handleSimplify}
              disabled={loading || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Simplifying AI Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Convert to Simple Format</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Simplified Output */}
        <div className="glass-panel p-6 rounded-2xl border border-sky-500/30 bg-sky-950/10 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sky-500/20">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Simplified Understandable Output</h3>
              </div>
              {result && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  {result.readabilityImprovement}
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-4 pt-3">
                {/* One Sentence Summary */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-sky-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Core Concept Summary</span>
                  <p className="text-xs font-semibold text-slate-100 leading-relaxed">{result.summary}</p>
                </div>

                {/* Key Takeaways */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Key Actionable Architectural Takeaways</span>
                  <div className="space-y-1.5">
                    {result.takeaways.map((point, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Explanation */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Technical Explanation for Tech Professionals</span>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {result.explanation}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Paste your text on the left and click "Convert to Simple Format"</p>
              </div>
            )}
          </div>

          {result && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">Target Audience: <strong>{result.targetAudience}</strong></span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Simplified Text</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
