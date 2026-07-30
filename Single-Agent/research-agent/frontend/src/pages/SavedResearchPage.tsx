import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Bookmark, Sparkles, Folder, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SavedResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Architecture', 'AI Systems', 'Databases', 'Security'];

  const savedItems = [
    {
      id: 'saved-1',
      title: 'PostgreSQL UUID v4 vs v7 Index Fragmentation Analysis',
      category: 'Databases',
      confidence: 96,
      summary: 'Comparative analysis proving UUID v7 provides 45% better B-tree index locality over random v4 UUIDs in high throughput write workloads.',
      sourcesCount: 8,
      date: '2026-07-20'
    },
    {
      id: 'saved-2',
      title: 'Gemini 2.5 Flash Benchmarks for Multi-Agent Orchestration',
      category: 'AI Systems',
      confidence: 94,
      summary: 'Latency benchmarks demonstrating 180ms time-to-first-token and ultra-low hallucination rates across structured JSON tool calls.',
      sourcesCount: 12,
      date: '2026-07-22'
    },
    {
      id: 'saved-3',
      title: 'FastAPI Async Engine Connection Pooling Best Practices',
      category: 'Architecture',
      confidence: 92,
      summary: 'Optimized asyncpg connection pool parameters preventing deadlocks during spike traffic in containerized Kubernetes clusters.',
      sourcesCount: 6,
      date: '2026-07-25'
    }
  ];

  const filteredItems = activeCategory === 'All'
    ? savedItems
    : savedItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-blue-400" />
          Saved Research Collections
        </h1>
        <p className="text-sm text-slate-400 mt-1">Bookmarked research reports and verified agent insights.</p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Saved Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="space-y-4 flex flex-col justify-between hover:border-blue-500/40">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="purple">{item.category}</Badge>
                <Badge variant="emerald">{item.confidence}% Verified</Badge>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>{item.sourcesCount} Verified Sources</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/research')}
                className="text-blue-400 hover:text-blue-300 gap-1"
              >
                View Report <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
