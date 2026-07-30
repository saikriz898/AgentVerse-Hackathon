import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { researchService } from '../services/researchService';
import { HistoryItem } from '../types/research';
import { History as HistoryIcon, Search, Trash2, ExternalLink, Calendar, Clock } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await researchService.getHistory(search);
      setItems(res.items);
    } catch (err) {
      console.error("Failed to load research history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this research record?")) return;
    try {
      await researchService.deleteResearch(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-blue-400" />
            Research History & Archive
          </h1>
          <p className="text-sm text-slate-400 mt-1">Browse, filter, and inspect past research sessions and output payloads.</p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search objectives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Research Objective</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Execution Time</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No research history records found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/research?id=${item.id}`)}
                    className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-100 group-hover:text-blue-400 max-w-md">
                      <div className="line-clamp-1">{item.objective}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 font-normal mt-0.5">{item.summary}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={item.confidence >= 90 ? 'emerald' : 'amber'}>
                        {item.confidence}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                      {item.execution_time}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/research?id=${item.id}`)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => handleDelete(item.id, e)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
