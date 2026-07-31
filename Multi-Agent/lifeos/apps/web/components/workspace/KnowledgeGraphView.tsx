'use client';

import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Share2,
  Network,
  Bot,
  Database,
  Layers,
  Sparkles,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Info,
  CheckCircle2,
  Zap,
  ShieldCheck,
  FileCode,
  ArrowRight,
  Filter,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Compass,
  Move,
  RotateCcw,
  Activity,
} from 'lucide-react';

export interface InteractiveGraphNode {
  id: string;
  label: string;
  role: string;
  category: 'HUB' | 'AGENT' | 'MEMORY' | 'DELIVERABLE';
  x: number; // percentage offset
  y: number; // percentage offset
  connections: string[];
  details: string;
  metrics: { latencyMs?: number; score?: number; rows?: number; docsCount?: number };
}

// Zero-overlap spatial node coordinates with generous margins
const SPACIOUS_NODES: InteractiveGraphNode[] = [
  // 1. Central Master AI Hub
  {
    id: 'chief-of-staff',
    label: '👑 Chief of Staff (Master AI Hub)',
    role: 'Master Orchestrator',
    category: 'HUB',
    x: 50,
    y: 50,
    connections: ['research-agent', 'planning-agent', 'review-agent', 'finance-agent', 'comm-agent', 'memory-agent'],
    details: 'Master AI Orchestrator executing 18-Stage SDLC pipelines, prompt gap analysis, and microservice fleet dispatch.',
    metrics: { score: 98, latencyMs: 14 },
  },

  // 2. Memory Hub (Top Center)
  {
    id: 'memory-agent',
    label: '🧠 Memory Agent (768-Dim RRF)',
    role: 'pgvector Vector Store',
    category: 'MEMORY',
    x: 50,
    y: 22,
    connections: ['chief-of-staff', 'mem-working', 'mem-knowledge'],
    details: 'Central Neon pgvector embedding engine combining dense similarity with sparse BM25 keyword RRF.',
    metrics: { rows: 2450, score: 99 },
  },

  // Memory Satellite Nodes
  {
    id: 'mem-working',
    label: '⚡ Working Memory Partition',
    role: 'Fast Memory Cache',
    category: 'MEMORY',
    x: 24,
    y: 10,
    connections: ['memory-agent'],
    details: 'Transient session context window stored in fast memory cache for active multi-agent loops.',
    metrics: { rows: 450 },
  },
  {
    id: 'mem-knowledge',
    label: '📖 Knowledge Base Partition',
    role: 'Curated Specs',
    category: 'MEMORY',
    x: 76,
    y: 10,
    connections: ['memory-agent'],
    details: 'Curated architectural specifications, OpenAPI schemas, and governance guidelines.',
    metrics: { rows: 520 },
  },

  // 3. Research Agent (Mid-Upper Left)
  {
    id: 'research-agent',
    label: '🔬 Research Agent',
    role: 'Web & Symbol Scraper',
    category: 'AGENT',
    x: 26,
    y: 36,
    connections: ['chief-of-staff', 'res-fact-checker'],
    details: 'Web Intelligence Scraper, Codebase Symbol Indexer, and 100% Fact Checking engine.',
    metrics: { score: 96, latencyMs: 25 },
  },
  {
    id: 'res-fact-checker',
    label: '✓ Fact Checking Matrix',
    role: 'Hallucination Gate',
    category: 'DELIVERABLE',
    x: 6,
    y: 26,
    connections: ['research-agent'],
    details: 'Verifies technical claims against authoritative documentation to prevent AI hallucinations.',
    metrics: { score: 100 },
  },

  // 4. Planning Agent (Mid-Upper Right)
  {
    id: 'planning-agent',
    label: '📅 Planning Agent',
    role: 'LangGraph DAG Engine',
    category: 'AGENT',
    x: 74,
    y: 36,
    connections: ['chief-of-staff', 'plan-dag-tree'],
    details: 'Constructs LangGraph DAG execution trees, task assignments, and 10-stage milestones.',
    metrics: { score: 97, latencyMs: 18 },
  },
  {
    id: 'plan-dag-tree',
    label: '⚡ LangGraph Execution DAG',
    role: 'Task DAG Tree',
    category: 'DELIVERABLE',
    x: 94,
    y: 26,
    connections: ['planning-agent'],
    details: 'Directed Acyclic Graph orchestrating multi-agent execution topology.',
    metrics: { score: 98 },
  },

  // 5. Review Agent (Mid-Lower Left)
  {
    id: 'review-agent',
    label: '🛡️ Review Agent (QA Gate)',
    role: 'OWASP & Test Runner',
    category: 'AGENT',
    x: 26,
    y: 64,
    connections: ['chief-of-staff', 'qa-test-suite'],
    details: 'OWASP Security Scanner, Secret Detector, and Automated 14/14 Test Cases Verification Suite.',
    metrics: { score: 98, latencyMs: 16 },
  },
  {
    id: 'qa-test-suite',
    label: '🧪 14/14 Test Cases Suite',
    role: 'Automated Test Runner',
    category: 'DELIVERABLE',
    x: 6,
    y: 74,
    connections: ['review-agent'],
    details: 'Jest & Cypress integration test suite runner (14/14 Passed - 0 Failures).',
    metrics: { score: 100 },
  },

  // 6. Finance Agent (Mid-Lower Right)
  {
    id: 'finance-agent',
    label: '💰 Finance Agent',
    role: 'Token & Cloud ROI',
    category: 'AGENT',
    x: 74,
    y: 64,
    connections: ['chief-of-staff', 'fin-cost-matrix'],
    details: 'Token Budget Estimator, Infrastructure Cost Predictor, and Multi-Cloud ROI Payback Calculator.',
    metrics: { score: 95, latencyMs: 22 },
  },
  {
    id: 'fin-cost-matrix',
    label: '💵 LLM Token Cost Estimator',
    role: 'Cost Calculator',
    category: 'DELIVERABLE',
    x: 94,
    y: 74,
    connections: ['finance-agent'],
    details: 'Calculates prompt & completion token consumption ($0.018/call average).',
    metrics: { score: 95 },
  },

  // 7. Communication Agent (Bottom Center)
  {
    id: 'comm-agent',
    label: '📧 Communication Agent',
    role: 'Presentation & Formats',
    category: 'AGENT',
    x: 50,
    y: 78,
    connections: ['chief-of-staff', 'comm-audiences', 'comm-doctypes'],
    details: 'Synthesizes technical outputs into 9 Audience Profiles across 19 Document Output Types with Zero-Fabrication rules.',
    metrics: { docsCount: 19, latencyMs: 19 },
  },
  {
    id: 'comm-audiences',
    label: '👥 9 Audience Profiles',
    role: 'Persona Engine',
    category: 'DELIVERABLE',
    x: 24,
    y: 90,
    connections: ['comm-agent'],
    details: 'Tailored persona transformations: Executive, Manager, Client, Professor, Developer, Team, Stakeholders, Lead, User.',
    metrics: { docsCount: 9 },
  },
  {
    id: 'comm-doctypes',
    label: '📄 19 Document Formats',
    role: 'Multi-Format Compiler',
    category: 'DELIVERABLE',
    x: 76,
    y: 90,
    connections: ['comm-agent'],
    details: 'Exec Summaries, Release Notes, API Docs, Meeting Notes, Professional Emails, HTML Reports, Daily Standups.',
    metrics: { docsCount: 19 },
  },
];

export const KnowledgeGraphView: React.FC = () => {
  const [nodes, setNodes] = useState<InteractiveGraphNode[]>(SPACIOUS_NODES);
  const [selectedNode, setSelectedNode] = useState<InteractiveGraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) setSelectedNode(node);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    const relativeY = ((e.clientY - rect.top) / rect.height) * 100;

    const boundedX = Math.max(3, Math.min(97, relativeX));
    const boundedY = Math.max(3, Math.min(97, relativeY));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: boundedX, y: boundedY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleResetNodes = () => {
    setNodes(SPACIOUS_NODES);
    setZoomLevel(100);
    setSelectedNode(null);
  };

  const filteredNodes = nodes.filter((n) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'AGENTS_ONLY') return n.category === 'HUB' || n.category === 'AGENT';
    if (filterCategory === 'MEMORY_ONLY') return n.category === 'MEMORY';
    return n.category === filterCategory;
  });

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden bg-background p-4 md:p-6 space-y-4 font-sans select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-accent-primary animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              Animated 2D Multi-Agent Knowledge Graph Topology
            </h1>
            <Badge variant="accent" className="font-mono text-[10px] flex items-center gap-1">
              <Activity className="h-3 w-3 animate-spin text-accent-primary" /> Animated Energy Lines Active
            </Badge>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Real-time energy pulse animations along SVG edges. Drag any node to reposition canvas.
          </p>
        </div>

        {/* Filter & Reset Toolbar */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center rounded-xl bg-surface-2 p-1 border border-border">
            {['ALL', 'AGENTS_ONLY', 'MEMORY_ONLY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider text-[10px] transition-luxury ${
                  filterCategory === cat
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {cat === 'ALL' ? 'All Nodes (15)' : cat === 'AGENTS_ONLY' ? '7 Agents' : 'Memory'}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={handleResetNodes} className="h-8 text-xs font-semibold">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-accent-primary" /> Reset Canvas Layout
          </Button>
        </div>
      </div>

      {/* Main Canvas + Inspector Drawer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden relative">
        {/* Interactive Canvas (Spans 3 cols) */}
        <div
          ref={canvasRef}
          className="lg:col-span-3 bg-surface-1 border border-border/80 rounded-2xl relative overflow-hidden flex items-center justify-center p-6 shadow-inner min-h-[520px]"
        >
          {/* Grid Background Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Scalable Container */}
          <div
            className="relative w-full h-full transition-transform duration-150 ease-out"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* SVG Connecting Lines with Animated Signal Pulses */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {filteredNodes.flatMap((sourceNode) =>
                sourceNode.connections.map((targetId) => {
                  const targetNode = nodes.find((n) => n.id === targetId);
                  if (!targetNode) return null;

                  return (
                    <g key={`${sourceNode.id}-${targetNode.id}`}>
                      {/* Base Line */}
                      <line
                        x1={`${sourceNode.x}%`}
                        y1={`${sourceNode.y}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y}%`}
                        stroke={
                          sourceNode.category === 'HUB'
                            ? 'rgba(99, 102, 241, 0.6)'
                            : sourceNode.category === 'AGENT'
                            ? 'rgba(99, 102, 241, 0.35)'
                            : 'rgba(16, 185, 129, 0.35)'
                        }
                        strokeWidth={sourceNode.category === 'HUB' ? '2' : '1.2'}
                      />

                      {/* Animated Signal Energy Pulse Dot along line */}
                      <circle
                        r="3"
                        fill={sourceNode.category === 'HUB' ? '#818cf8' : '#34d399'}
                        className="animate-pulse"
                      >
                        <animate
                          attributeName="cx"
                          from={`${sourceNode.x}%`}
                          to={`${targetNode.x}%`}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          from={`${sourceNode.y}%`}
                          to={`${targetNode.y}%`}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })
              )}
            </svg>

            {/* Draggable & Animated Graph Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isDragging = draggingNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 group"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-200 hover:-translate-y-1 ${
                      isDragging
                        ? 'ring-4 ring-accent-primary/60 scale-110 z-40 bg-accent-light border-accent-primary text-accent-primary font-bold'
                        : isSelected
                        ? 'ring-2 ring-accent-primary bg-accent-light border-accent-primary text-accent-primary font-bold scale-105 z-30'
                        : node.category === 'HUB'
                        ? 'bg-indigo-950/90 border-indigo-500 text-indigo-200 font-bold shadow-indigo-500/40 ring-1 ring-indigo-500/50'
                        : node.category === 'AGENT'
                        ? 'bg-surface-2/95 border-indigo-500/40 text-indigo-300 hover:border-indigo-500 hover:shadow-indigo-500/20'
                        : node.category === 'MEMORY'
                        ? 'bg-surface-2/95 border-emerald-500/40 text-emerald-300 hover:border-emerald-500 hover:shadow-emerald-500/20'
                        : 'bg-surface-2/95 border-purple-500/40 text-purple-300 hover:border-purple-500 hover:shadow-purple-500/20'
                    }`}
                  >
                    <Move className="h-3 w-3 opacity-30 group-hover:opacity-100 shrink-0 text-text-muted" />

                    {node.category === 'HUB' && <Bot className="h-4 w-4 shrink-0 text-indigo-400 animate-pulse" />}
                    {node.category === 'AGENT' && <Bot className="h-3.5 w-3.5 shrink-0 text-indigo-400" />}
                    {node.category === 'MEMORY' && <Database className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                    {node.category === 'DELIVERABLE' && <Zap className="h-3.5 w-3.5 shrink-0 text-purple-400" />}

                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-bold leading-tight whitespace-nowrap">{node.label}</span>
                      <span className="text-[9px] font-mono text-text-muted font-medium leading-tight">{node.role}</span>
                    </div>

                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0 ml-0.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Zoom & Controls Dock */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-surface-1/90 backdrop-blur-md border border-border/80 p-2 rounded-2xl shadow-xl text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
              className="p-1.5 rounded-xl hover:bg-surface-2 text-text-muted hover:text-text-primary"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <span className="font-mono text-xs font-bold px-1 min-w-[45px] text-center text-text-primary">
              {zoomLevel}%
            </span>

            <button
              onClick={() => setZoomLevel((z) => Math.min(250, z + 15))}
              className="p-1.5 rounded-xl hover:bg-surface-2 text-text-muted hover:text-text-primary"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <div className="h-4 w-px bg-border/60 mx-1" />

            <button
              onClick={() => setZoomLevel(100)}
              className="p-1.5 rounded-xl hover:bg-surface-2 text-text-muted hover:text-text-primary flex items-center gap-1 font-mono text-[11px]"
            >
              <Maximize2 className="h-3.5 w-3.5" /> 100% Reset
            </button>
          </div>
        </div>

        {/* Right Node Inspector Drawer */}
        <div className="lg:col-span-1 bg-surface-1 border border-border/80 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-md">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-4 w-4 text-accent-primary" /> Node Inspector
              </span>
              <Badge variant="accent" className="text-[10px] font-mono">
                {selectedNode ? selectedNode.category : 'Interactive'}
              </Badge>
            </div>

            {selectedNode ? (
              <div className="space-y-3 pt-3 animate-in fade-in text-xs">
                <div>
                  <h3 className="font-bold text-sm text-text-primary">{selectedNode.label}</h3>
                  <span className="text-[11px] font-mono text-accent-primary font-semibold">{selectedNode.role}</span>
                  <p className="text-text-secondary text-xs mt-2 leading-relaxed">{selectedNode.details}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <span className="text-[11px] font-semibold text-text-muted uppercase">Telemetry & Metrics:</span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                    {selectedNode.metrics.score && (
                      <div className="p-2 rounded-xl bg-surface-2 border border-border/60 text-emerald-400 font-bold">
                        Score: {selectedNode.metrics.score}/100
                      </div>
                    )}
                    {selectedNode.metrics.latencyMs && (
                      <div className="p-2 rounded-xl bg-surface-2 border border-border/60 text-indigo-400 font-bold">
                        Latency: {selectedNode.metrics.latencyMs}ms
                      </div>
                    )}
                    {selectedNode.metrics.docsCount && (
                      <div className="p-2 rounded-xl bg-surface-2 border border-border/60 text-purple-400 font-bold">
                        Docs: {selectedNode.metrics.docsCount} Formats
                      </div>
                    )}
                    {selectedNode.metrics.rows && (
                      <div className="p-2 rounded-xl bg-surface-2 border border-border/60 text-emerald-400 font-bold col-span-2">
                        pgvector Rows: {selectedNode.metrics.rows}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 space-y-1">
                  <span className="text-[11px] font-semibold text-text-muted uppercase">Connected Topology Edges ({selectedNode.connections.length}):</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedNode.connections.map((cId) => (
                      <span key={cId} className="px-2 py-0.5 rounded-lg bg-surface-2 border border-border/60 font-mono text-[10px] text-text-secondary">
                        → {cId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-text-muted space-y-2">
                <Network className="h-8 w-8 mx-auto text-accent-primary/60 animate-pulse" />
                <p className="text-xs">Click or drag any node on the graph canvas to inspect live telemetry, RRF vector scores, and connected microservices.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border/60 text-[11px] font-mono text-text-muted flex items-center justify-between">
            <span>Synced with Neon pgvector</span>
            <span className="text-emerald-400 font-bold">15 Nodes Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
