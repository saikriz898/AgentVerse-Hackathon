'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileText, Download, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const DocumentsView: React.FC = () => {
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtifact, setSelectedArtifact] = useState<any | null>(null);

  const fetchArtifacts = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getArtifacts();
      setArtifacts(data.artifacts || []);
      if (data.artifacts && data.artifacts.length > 0) {
        setSelectedArtifact(data.artifacts[0]);
      }
    } catch (err) {
      console.warn('Artifacts API fallback...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Artifact & Document Manager</Badge>
            <Badge variant="outline" className="font-mono">Realtime Specs</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Documents & Artifacts ({artifacts.length})
          </h1>
          <p className="text-sm text-text-secondary">
            Generated PRDs, System Architecture Specs, DB Schemas, and QA Reports stored in LifeOS Core Backend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchArtifacts} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 stroke-[1.75] ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Artifact Grid & Live Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Artifact List */}
        <div className="space-y-3 lg:col-span-1">
          {artifacts.map((art) => (
            <Card
              key={art.id}
              onClick={() => setSelectedArtifact(art)}
              className={`p-4 cursor-pointer transition-luxury border ${
                selectedArtifact?.id === art.id ? 'border-accent-primary bg-accent-light/10' : 'bg-surface-1 border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-accent-primary" />
                  <span className="font-bold text-xs text-text-primary">{art.title}</span>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">{art.version}</Badge>
              </div>
              <p className="mt-2 text-[11px] text-text-muted line-clamp-1">{art.category} • Author: {art.authorAgent || 'Chief of Staff'}</p>
            </Card>
          ))}
        </div>

        {/* Right Column: Selected Artifact Content Viewer */}
        <div className="lg:col-span-2">
          {selectedArtifact ? (
            <Card className="p-6 bg-surface-1 space-y-4 border border-border">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h2 className="font-bold text-base text-text-primary">{selectedArtifact.title}</h2>
                  <span className="text-xs font-mono text-text-muted">Version {selectedArtifact.version}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download Markdown
                </Button>
              </div>

              <div className="bg-surface-secondary p-5 rounded-xl border border-border/60 font-mono text-xs text-text-primary overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {selectedArtifact.content}
              </div>
            </Card>
          ) : (
            <Card className="p-8 bg-surface-1 text-center text-text-muted text-xs">
              Select an artifact to preview specification details.
            </Card>
          )}
        </div>
      </div>
    </main>
  );
};
