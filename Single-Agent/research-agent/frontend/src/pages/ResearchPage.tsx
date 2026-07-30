import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { researchService } from '../services/researchService';
import { ResearchResponse, ResearchFilters } from '../types/research';
import { 
  Search, 
  Sparkles, 
  Filter, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Download, 
  Share2, 
  BookOpen, 
  FileCode, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

export const ResearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialId = searchParams.get('id') || '';

  const [objective, setObjective] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [executionStep, setExecutionStep] = useState<string>('');
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'executive' | 'full' | 'references' | 'factcheck' | 'json'>('executive');
  
  // Advanced filters state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ResearchFilters>({
    date_range: 'all',
    sources: ['web', 'docs', 'github', 'papers'],
    min_confidence: 70,
    category: 'General'
  });

  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    if (initialId) {
      setLoading(true);
      researchService.getResultById(initialId)
        .then(setResult)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (initialQuery) {
      handleRunResearch(initialQuery);
    }
  }, [initialId, initialQuery]);

  const handleRunResearch = async (queryToRun: string) => {
    if (!queryToRun.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    // Simulated progress steps
    const steps = [
      'Understanding research objective & query expansion...',
      'Searching multi-source web crawlers...',
      'Scraping and parsing article content...',
      'Cross-verifying factual claims & calculating confidence...',
      'Synthesizing findings via Gemini AI engine...'
    ];

    let stepIdx = 0;
    setExecutionStep(steps[0]);
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setExecutionStep(steps[stepIdx]);
      }
    }, 1000);

    try {
      const res = await researchService.startResearch(queryToRun, filters);
      setResult(res);
    } catch (err: any) {
      console.error("Research execution failed:", err);
      const msg = err?.response?.data?.detail || err?.message || "Research request encountered an error.";
      setErrorMsg(msg);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setExecutionStep('');
    }
  };

  const handleFilterToggleSource = (sourceName: string) => {
    const current = filters.sources || [];
    const updated = current.includes(sourceName)
      ? current.filter(s => s !== sourceName)
      : [...current, sourceName];
    setFilters({ ...filters, sources: updated });
  };

  const handleExportJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-research-${result.request_id}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Search Input Box */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-white">LifeOS Deep Research Workspace</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`gap-2 ${showFilters ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400'}`}
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
          </Button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunResearch(objective);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Enter research query (e.g. Compare PostgreSQL UUID vs INT primary keys under high concurrency)"
              className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
            />
            {objective && (
              <button
                type="button"
                onClick={() => setObjective('')}
                className="absolute right-3 top-3.5 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>
          <Button type="submit" variant="primary" disabled={loading} className="gap-2 px-6">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Analyzing...' : 'Execute Deep Research'}
          </Button>
        </form>

        {/* Advanced Filters Expandable Drawer */}
        {showFilters && (
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Source Types</label>
              <div className="flex flex-wrap gap-2">
                {['web', 'docs', 'github', 'papers', 'wikipedia'].map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => handleFilterToggleSource(src)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      filters.sources?.includes(src)
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Date Range</label>
              <select
                value={filters.date_range}
                onChange={(e) => setFilters({ ...filters, date_range: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Any Time</option>
                <option value="past_year">Past Year</option>
                <option value="past_month">Past Month</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Min Confidence ({filters.min_confidence}%)</label>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={filters.min_confidence}
                onChange={(e) => setFilters({ ...filters, min_confidence: Number(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="General">General Technical</option>
                <option value="Architecture">Software Architecture</option>
                <option value="AI">AI & Machine Learning</option>
                <option value="Security">Security & DevOps</option>
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Error Message Banner */}
      {errorMsg && (
        <Card className="py-4 border-rose-500/40 bg-rose-500/10 text-rose-300 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="text-sm font-semibold">{errorMsg}</p>
        </Card>
      )}

      {/* Loading Progress Visualizer */}
      {loading && (
        <Card className="py-12 text-center space-y-4 border-blue-500/30">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Autonomous Research Pipeline In Progress</h3>
            <p className="text-xs text-blue-400 font-medium animate-pulse">{executionStep}</p>
          </div>
        </Card>
      )}

      {/* Research Results Display */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Header Result Card */}
          <Card className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="blue">{result.agent} Agent</Badge>
                  <span className="text-xs text-slate-500">ID: {result.request_id.substring(0, 8)}...</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{objective}</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Confidence Score</span>
                  <span className="text-2xl font-black text-emerald-400">{result.confidence}%</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-1.5">
                  <Download className="w-4 h-4" />
                  Export JSON
                </Button>
              </div>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 pt-1">
              {result.keywords.map((kw, i) => (
                <Badge key={i} variant="purple">#{kw}</Badge>
              ))}
              <span className="text-xs text-slate-500 self-center ml-auto">Latency: {result.execution_time}</span>
            </div>
          </Card>

          {/* Result Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
            {[
              { id: 'executive', label: 'Executive Summary', icon: Sparkles },
              { id: 'full', label: 'Detailed Report', icon: BookOpen },
              { id: 'references', label: `References (${result.references.length})`, icon: ExternalLink },
              { id: 'factcheck', label: 'Fact Check Verification', icon: ShieldCheck },
              { id: 'json', label: 'Raw JSON Payload', icon: FileCode },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Executive Summary */}
          {activeTab === 'executive' && (
            <Card className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Executive Overview</h3>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {result.executive_summary || result.summary}
                </p>
              </div>

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Agent Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-blue-400">Recommendation #{i + 1}</span>
                        <p className="leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Tab 2: Detailed Report */}
          {activeTab === 'full' && (
            <Card className="space-y-4">
              <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {result.summary}
              </div>
            </Card>
          )}

          {/* Tab 3: References List */}
          {activeTab === 'references' && (
            <Card className="space-y-4">
              <h3 className="text-base font-bold text-white">Extracted Multi-Source References</h3>
              <div className="grid grid-cols-1 gap-3">
                {result.references.map((ref, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="blue">{ref.website_name}</Badge>
                        <span className="text-xs text-slate-500">Date: {ref.published_date || '2026'}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-100">{ref.article_title}</h4>
                      <p className="text-xs text-slate-400 break-all">{ref.url}</p>
                    </div>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-blue-400 font-medium transition-all shrink-0"
                    >
                      Open Link <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tab 4: Fact Check */}
          {activeTab === 'factcheck' && (
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Cross-Source Fact Checker Verification</h3>
                </div>
                <Badge variant={result.fact_check_details?.verified ? 'emerald' : 'amber'}>
                  {result.fact_check_details?.verification_status || 'Verified across independent sources'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Matching Sources</span>
                  <span className="text-xl font-bold text-emerald-400">{result.fact_check_details?.matching_source_count ?? result.references.length}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Detected Contradictions</span>
                  <span className="text-xl font-bold text-blue-400">{result.fact_check_details?.contradictions_count ?? 0}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Confidence Level</span>
                  <span className="text-xl font-bold text-amber-400">{result.fact_check_details?.confidence_level ?? 'High'}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Tab 5: JSON Output */}
          {activeTab === 'json' && (
            <Card className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Standard LifeOS Output JSON</span>
                <Button size="sm" variant="outline" onClick={handleExportJSON}>Copy / Download JSON</Button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
