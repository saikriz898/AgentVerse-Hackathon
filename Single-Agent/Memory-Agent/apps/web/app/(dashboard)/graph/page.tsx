'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  Database,
  BookOpen,
  FolderKanban,
  X,
  Download,
  Share2,
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  GitBranch,
  Compass,
  Pin,
  Star,
  Bookmark,
  Move,
  Eye,
  SlidersHorizontal,
  Target,
  Maximize,
} from 'lucide-react';
import Link from 'next/link';

export default function GraphPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'force' | 'hierarchical' | 'radial' | 'organic'>('force');
  const [focusDepth, setFocusDepth] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // 2D Smart Camera System State
  const [cameraX, setCameraX] = useState<number>(0);
  const [cameraY, setCameraY] = useState<number>(0);
  const [cameraZoom, setCameraZoom] = useState<number>(1.0); // 0.05 (5%) to 6.0 (600%)
  const [savedCamera, setSavedCamera] = useState<{ x: number; y: number; zoom: number } | null>(null);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const [draggedPositions, setDraggedPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragNodeOffset, setDragNodeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isClustersCollapsed, setIsClustersCollapsed] = useState(false);
  const [pinnedNodes, setPinnedNodes] = useState<Set<string>>(new Set());

  const canvasRef = useRef<HTMLDivElement>(null);

  // Space Key Canvas Pan Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Fetch real backend graph topology & analytics
  const { data, isLoading } = useQuery({
    queryKey: ['graphTopologyV4', filterType, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      const qStr = params.toString() ? `?${params.toString()}` : '';
      return fetchApi(`/graph${qStr}`);
    },
    staleTime: 60 * 1000,
  });

  const defaultNodes = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      label: 'Antigravity Platform Architecture Guidelines',
      title: 'Antigravity Platform Architecture Guidelines',
      type: 'knowledge',
      subType: 'Architecture',
      content: 'Core multi-agent coordination system specifications, memory persistence rules, and REST API contract standards.',
      importance: 0.95,
      updatedAt: 'Updated 1h ago',
      color: '#A855F7',
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      label: 'Gemini Text-Embedding-004 Configuration',
      title: 'Gemini Text-Embedding-004 Configuration',
      type: 'memory',
      subType: 'working',
      content: 'All memory embeddings are generated with 768 dimensions using Gemini API text-embedding-004 model.',
      importance: 0.85,
      updatedAt: 'Updated 2h ago',
      color: '#2563EB',
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440001',
      label: 'Antigravity Platform Rebuild',
      title: 'Antigravity Platform Rebuild',
      type: 'project',
      subType: 'PRJ-01',
      content: 'Enterprise Memory Agent UI/UX overhaul, standardizing design tokens, fixed viewport containers, and REST API contracts.',
      importance: 0.92,
      updatedAt: 'Updated 15m ago',
      color: '#F59E0B',
    },
  ];

  const rawNodes = data?.nodes && data.nodes.length > 0 ? data.nodes : defaultNodes;

  const nodes = useMemo(() => {
    if (!showFavoritesOnly) return rawNodes;
    return rawNodes.filter((n: any) => n.importance >= 0.9);
  }, [rawNodes, showFavoritesOnly]);

  const defaultEdges = [
    { id: 'edge-1', source: nodes[0]?.id, target: nodes[1]?.id, relationType: 'references', weight: 0.9 },
    { id: 'edge-2', source: nodes[1]?.id, target: nodes[2]?.id, relationType: 'belongs_to', weight: 0.85 },
  ];

  const edges = data?.edges && data.edges.length > 0 ? data.edges : defaultEdges;
  const stats = data?.statistics || {
    totalNodes: nodes.length,
    visibleNodes: nodes.length,
    hiddenNodes: 0,
    totalEdges: edges.length,
    clustersCount: 3,
    mostConnectedNode: nodes[0]?.title || 'Antigravity Platform',
    density: '0.333',
  };

  // Layout Engine Algorithm Calculations
  const layoutNodes = useMemo(() => {
    const total = nodes.length;
    const centerX = 600;
    const centerY = 400;

    return nodes.map((node: any, idx: number) => {
      let x = centerX;
      let y = centerY;

      if (isClustersCollapsed) {
        if (node.type === 'memory') {
          x = centerX - 260;
          y = centerY + ((idx % 5) - 2) * 60;
        } else if (node.type === 'knowledge') {
          x = centerX;
          y = centerY - 180 + ((idx % 4) - 1.5) * 50;
        } else {
          x = centerX + 260;
          y = centerY + ((idx % 5) - 2) * 60;
        }
      } else if (layoutMode === 'radial') {
        const angle = (idx / Math.max(total, 1)) * 2 * Math.PI - Math.PI / 2;
        const radius = Math.min(280, 120 + Math.floor(idx / 8) * 70);
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      } else if (layoutMode === 'hierarchical') {
        const cols = Math.min(Math.max(Math.ceil(Math.sqrt(total)), 3), 6);
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        x = centerX - ((cols - 1) * 120) / 2 + col * 120;
        y = centerY - 160 + row * 110;
      } else if (layoutMode === 'organic') {
        const angle = idx * 2.4;
        const radius = Math.min(300, 80 + Math.sqrt(idx + 1) * 65);
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      } else {
        // Force-Directed Physics Ring Spiral
        const ring = Math.floor(idx / 6);
        const ringIndex = idx % 6;
        const angle = (ringIndex / 6) * 2 * Math.PI + ring * 0.45;
        const radius = Math.min(320, 110 + ring * 80);
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      }

      if (draggedPositions[node.id]) {
        x = draggedPositions[node.id].x;
        y = draggedPositions[node.id].y;
      }

      return { ...node, x, y };
    });
  }, [nodes, layoutMode, isClustersCollapsed, draggedPositions]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, any>();
    layoutNodes.forEach((n: any) => map.set(n.id, n));
    return map;
  }, [layoutNodes]);

  // Compute Multi-Hop Focus Neighborhood based on Focus Depth (1, 2, 3)
  const connectedInfo = useMemo(() => {
    const activeId = selectedNode?.id || hoveredNodeId;
    if (!activeId) return { connectedNodeIds: new Set<string>(), connectedEdgeIds: new Set<string>() };

    const connectedNodeIds = new Set<string>([activeId]);
    const connectedEdgeIds = new Set<string>();

    let currentLevel = new Set<string>([activeId]);

    for (let depth = 0; depth < focusDepth; depth++) {
      const nextLevel = new Set<string>();
      edges.forEach((e: any) => {
        if (currentLevel.has(e.source)) {
          connectedNodeIds.add(e.target);
          connectedEdgeIds.add(e.id);
          nextLevel.add(e.target);
        } else if (currentLevel.has(e.target)) {
          connectedNodeIds.add(e.source);
          connectedEdgeIds.add(e.id);
          nextLevel.add(e.source);
        }
      });
      currentLevel = nextLevel;
    }

    return { connectedNodeIds, connectedEdgeIds };
  }, [selectedNode, hoveredNodeId, edges, focusDepth]);

  // Smart Camera Fly-To Node Focus Handler
  const flyToNode = (node: any) => {
    setSelectedNode(node);
    const targetX = (360 - node.x) * cameraZoom;
    const targetY = (240 - node.y) * cameraZoom;
    setCameraX(targetX);
    setCameraY(targetY);
  };

  const handleNodeMouseDown = (node: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingNodeId(node.id);
    setDragNodeOffset({
      x: e.clientX - node.x * cameraZoom,
      y: e.clientY - node.y * cameraZoom,
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - cameraX, y: e.clientY - cameraY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const newX = (e.clientX - dragNodeOffset.x) / cameraZoom;
      const newY = (e.clientY - dragNodeOffset.y) / cameraZoom;
      setDraggedPositions((prev) => ({
        ...prev,
        [draggingNodeId]: { x: newX, y: newY },
      }));
      return;
    }

    if (isPanning) {
      setCameraX(e.clientX - panStart.x);
      setCameraY(e.clientY - panStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // Non-Passive Wheel Event Listener for Canvas Viewport Isolation
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const handleCanvasWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.ctrlKey) {
        // Precision Camera Zoom
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        setCameraZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.05), 6.0));
      } else {
        // Trackpad Pan or Mouse Wheel Zoom
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          setCameraX((prev) => prev - e.deltaX);
        } else {
          const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
          setCameraZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.05), 6.0));
        }
      }
    };

    canvasEl.addEventListener('wheel', handleCanvasWheel, { passive: false });
    return () => canvasEl.removeEventListener('wheel', handleCanvasWheel);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  const saveCameraBookmark = () => {
    setSavedCamera({ x: cameraX, y: cameraY, zoom: cameraZoom });
  };

  const restoreCameraBookmark = () => {
    if (savedCamera) {
      setCameraX(savedCamera.x);
      setCameraY(savedCamera.y);
      setCameraZoom(savedCamera.zoom);
    }
  };

  const resetCamera = () => {
    setCameraX(0);
    setCameraY(0);
    setCameraZoom(1.0);
  };

  const exportGraphJson = () => {
    const jsonStr = JSON.stringify({ nodes, edges, statistics: stats, camera: { x: cameraX, y: cameraY, zoom: cameraZoom } }, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graph-v4-infinite-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => setCameraZoom((prev) => Math.min(prev * 1.25, 6.0));
  const handleZoomOut = () => setCameraZoom((prev) => Math.max(prev * 0.8, 0.05));

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`h-full flex gap-6 relative select-none font-sans text-[#111827] dark:text-neutral-100 overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#090909] p-6' : ''
      }`}
    >
      {/* Main Viewport */}
      <div className="flex-1 flex flex-col justify-between min-w-0 h-full overflow-hidden relative">
        {/* Fixed Header & Analytics Banner (shrink-0) */}
        <div className="shrink-0 space-y-3 pb-1">
          <PageHeader
            breadcrumb={['Workspace', 'Graph Topology']}
            title="Relationship Graph Topology"
            description="Infinite canvas with smart camera interpolation, Bezier curved edge routing, animated particle pulses, and 5%-600% multi-tier semantic zoom."
            className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
          />

          {/* Top Analytics Cluster Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
            <div className="p-2 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Total Nodes</span>
              <span className="font-bold text-[#2563EB] dark:text-blue-400">{stats.totalNodes}</span>
            </div>

            <div className="p-2 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Visible</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.visibleNodes}</span>
            </div>

            <div className="p-2 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Connections</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{stats.totalEdges}</span>
            </div>

            <div className="p-2 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Clusters</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{stats.clustersCount}</span>
            </div>

            <div className="p-2 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl flex items-center justify-between truncate col-span-2 sm:col-span-2">
              <span className="text-[#6B7280] dark:text-neutral-400 truncate">Max Hub</span>
              <span className="font-bold text-[#111827] dark:text-white truncate">{stats.mostConnectedNode}</span>
            </div>
          </div>

          {/* Controls Toolbar: Layout Switcher + Focus Depth + Search + Camera Bookmarks */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Layout Algorithm Switcher */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl w-full sm:w-auto overflow-x-auto shadow-sm dark:shadow-none">
              {[
                { id: 'force', label: 'Physics', icon: Activity },
                { id: 'radial', label: 'Orbits', icon: Compass },
                { id: 'hierarchical', label: 'Tree', icon: GitBranch },
                { id: 'organic', label: 'Organic', icon: Layers },
              ].map((l) => {
                const Icon = l.icon;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLayoutMode(l.id as any)}
                    className={`h-[28px] px-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                      layoutMode === l.id
                        ? 'bg-[#2563EB]/15 text-[#2563EB] dark:text-blue-300 border border-[#2563EB]/30'
                        : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{l.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Focus Depth Expansion Pills */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl w-full sm:w-auto shadow-sm dark:shadow-none">
              <span className="text-[10px] font-mono text-[#6B7280] dark:text-neutral-400 uppercase px-1.5 font-bold">Focus Depth</span>
              {[1, 2, 3].map((depth) => (
                <button
                  key={depth}
                  onClick={() => setFocusDepth(depth)}
                  className={`h-[24px] px-2 rounded-md text-[11px] font-mono font-bold transition-all ${
                    focusDepth === depth
                      ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                      : 'text-[#6B7280] dark:text-neutral-400 hover:text-white'
                  }`}
                >
                  D{depth}
                </button>
              ))}
            </div>

            {/* Camera Bookmark Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={saveCameraBookmark}
                title="Save Current Camera Bookmark"
                className="h-[30px] px-2.5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-purple-500/10 hover:text-purple-400 text-gray-400 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save View</span>
              </button>
              {savedCamera && (
                <button
                  onClick={restoreCameraBookmark}
                  title="Fly to Saved Camera Bookmark"
                  className="h-[30px] px-2.5 bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-colors"
                >
                  Fly to Saved
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2D Smart Camera Infinite Canvas Viewport */}
        <div
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className={`flex-1 relative bg-white dark:bg-[#141519] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl overflow-hidden my-1.5 shadow-sm dark:shadow-none flex items-center justify-center ${
            isPanning ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {isLoading ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-[#6B7280] dark:text-neutral-400 font-mono">Simulating camera infinite canvas topology...</p>
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-75"
              style={{ transform: `translate(${cameraX}px, ${cameraY}px) scale(${cameraZoom})` }}
            >
              <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <pattern id="dotGridV4" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#9CA3AF" opacity="0.15" />
                  </pattern>

                  {/* Bezier Edge Particle Gradient */}
                  <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#dotGridV4)" />

                {/* Bezier Curved Intelligent Edge Routing with Moving Particles */}
                {edges.map((edge: any, idx: number) => {
                  const sourceNode = nodeMap.get(edge.source);
                  const targetNode = nodeMap.get(edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const isHighlighted = connectedInfo.connectedEdgeIds.has(edge.id);
                  const dx = targetNode.x - sourceNode.x;
                  const dy = targetNode.y - sourceNode.y;
                  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                  const midX = (sourceNode.x + targetNode.x) / 2;
                  const midY = (sourceNode.y + targetNode.y) / 2;

                  // Smooth Quadratic Bezier Path with orthogonal control offset
                  const offsetAmount = (idx % 2 === 0 ? 1 : -1) * Math.min(40, dist * 0.15);
                  const ctrlX = midX - (dy / dist) * offsetAmount;
                  const ctrlY = midY + (dx / dist) * offsetAmount;

                  const pathData = `M ${sourceNode.x} ${sourceNode.y} Q ${ctrlX} ${ctrlY} ${targetNode.x} ${targetNode.y}`;

                  return (
                    <g key={edge.id || idx}>
                      {/* Bezier Curved Connection Path */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={isHighlighted ? '#2563EB' : '#9CA3AF'}
                        strokeOpacity={(selectedNode?.id || hoveredNodeId) ? (isHighlighted ? '0.9' : '0.1') : '0.35'}
                        strokeWidth={isHighlighted ? '2.5' : '1.5'}
                        strokeDasharray={isHighlighted ? '6 3' : 'none'}
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* Moving Particle Pulse along Bezier Path (Shown when edge is active) */}
                      {isHighlighted && (
                        <circle r="3" fill="#60A5FA">
                          <animateMotion path={pathData} dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Semantic Zoom Edge Label Pills (Shown at cameraZoom >= 60%) */}
                      {cameraZoom >= 0.6 && (
                        <g transform={`translate(${ctrlX - 30}, ${ctrlY - 9})`}>
                          <rect
                            width="60"
                            height="18"
                            rx="4"
                            fill="#171717"
                            stroke={isHighlighted ? '#2563EB' : '#333333'}
                            strokeWidth="1"
                            opacity={(selectedNode?.id || hoveredNodeId) ? (isHighlighted ? '1' : '0.2') : '0.8'}
                          />
                          <text
                            x="30"
                            y="12"
                            textAnchor="middle"
                            fill={isHighlighted ? '#60A5FA' : '#9CA3AF'}
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {edge.relationType || 'references'}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* SVG Graph Nodes with Multi-Tier Semantic Zoom (5% to 600%) */}
                {layoutNodes.map((node: any) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const isConnected = connectedInfo.connectedNodeIds.has(node.id);

                  const opacity = (selectedNode?.id || hoveredNodeId) ? (isConnected ? 1 : 0.2) : 1;
                  const nodeColor = node.type === 'knowledge' ? '#A855F7' : node.type === 'project' ? '#F59E0B' : '#2563EB';

                  return (
                    <g
                      key={node.id}
                      onMouseDown={(e) => handleNodeMouseDown(node, e)}
                      onClick={() => flyToNode(node)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      style={{ opacity, transition: 'all 0.2s ease-out' }}
                      className="cursor-move group"
                    >
                      {/* Selection / Hover Glow Ring */}
                      {(isSelected || isHovered) && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isHovered ? '32' : '28'}
                          fill={nodeColor}
                          fillOpacity="0.25"
                          stroke={nodeColor}
                          strokeWidth="2"
                          className="animate-pulse"
                        />
                      )}

                      {/* Tier 1 & 2: Node Circle & Icon (cameraZoom >= 15%) */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isHovered ? '22' : '19'}
                        fill={nodeColor}
                        fillOpacity={isSelected || isHovered ? '1' : '0.8'}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />

                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                      >
                        {node.type === 'knowledge' ? 'K' : node.type === 'project' ? 'P' : 'M'}
                      </text>

                      {/* Tier 3: Title Pill (60% <= cameraZoom < 140%) */}
                      {cameraZoom >= 0.6 && cameraZoom < 1.4 && (
                        <g transform={`translate(${node.x}, ${node.y + 30})`}>
                          <rect
                            x="-65"
                            y="-10"
                            width="130"
                            height="20"
                            rx="6"
                            fill="#171717"
                            stroke={isSelected || isHovered ? nodeColor : '#333333'}
                            strokeWidth="1"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            {node.title.length > 18 ? `${node.title.slice(0, 16)}...` : node.title}
                          </text>
                        </g>
                      )}

                      {/* Tier 4: Floating Glass Card (140% <= cameraZoom < 300%) */}
                      {cameraZoom >= 1.4 && cameraZoom < 3.0 && (
                        <g transform={`translate(${node.x - 90}, ${node.y + 30})`}>
                          <rect width="180" height="75" rx="10" fill="#141519" stroke={nodeColor} strokeWidth="1.5" />
                          <text x="12" y="20" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                            {node.title.length > 22 ? `${node.title.slice(0, 20)}...` : node.title}
                          </text>
                          <text x="12" y="38" fill="#9CA3AF" fontSize="9" fontFamily="sans-serif">
                            {node.content ? `${node.content.slice(0, 32)}...` : 'Linked knowledge spec node.'}
                          </text>
                          <text x="12" y="58" fill={nodeColor} fontSize="9" fontFamily="monospace" fontWeight="bold">
                            TYPE: {node.type.toUpperCase()} • ID: {node.id.slice(0, 6)}
                          </text>
                        </g>
                      )}

                      {/* Tier 5: Full Inline Inspector Card (cameraZoom >= 300%) */}
                      {cameraZoom >= 3.0 && (
                        <g transform={`translate(${node.x - 120}, ${node.y + 30})`}>
                          <rect width="240" height="120" rx="12" fill="#141519" stroke={nodeColor} strokeWidth="2" />
                          <text x="14" y="24" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                            {node.title}
                          </text>
                          <text x="14" y="46" fill="#9CA3AF" fontSize="10" fontFamily="sans-serif">
                            {node.content || 'Enterprise knowledge node spec.'}
                          </text>
                          <text x="14" y="80" fill="#60A5FA" fontSize="10" fontFamily="monospace">
                            Workspace: {node.workspace || 'Development Workspace'}
                          </text>
                          <text x="14" y="100" fill={nodeColor} fontSize="10" fontFamily="monospace" fontWeight="bold">
                            Status: ACTIVE TOPOLOGY NODE
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Floating Glassmorphism Control Dock V4.0 (Fixed Top-Right) */}
          <div className="absolute top-4 right-4 z-20 bg-black/75 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl flex items-center gap-2 shadow-2xl text-xs select-none">
            {/* Zoom Slider (5% to 600%) */}
            <div className="flex items-center gap-1.5 px-2 border-r border-white/10 font-mono text-[11px] text-gray-300">
              <button onClick={handleZoomOut} className="p-1 hover:text-white"><ZoomOut className="w-3.5 h-3.5" /></button>
              <span>{(cameraZoom * 100).toFixed(0)}%</span>
              <button onClick={handleZoomIn} className="p-1 hover:text-white"><ZoomIn className="w-3.5 h-3.5" /></button>
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-2.5 py-1 rounded-xl flex items-center gap-1 font-medium transition-colors ${
                showFavoritesOnly ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => setIsClustersCollapsed(!isClustersCollapsed)}
              className={`px-2.5 py-1 rounded-xl flex items-center gap-1 font-medium transition-colors ${
                isClustersCollapsed ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isClustersCollapsed ? 'Expand' : 'Collapse'}</span>
            </button>

            <button onClick={resetCamera} title="Reset Camera View" className="p-1.5 text-gray-300 hover:text-white rounded-lg">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button onClick={exportGraphJson} title="Export JSON Structure" className="p-1.5 text-gray-300 hover:text-white rounded-lg">
              <Download className="w-3.5 h-3.5" />
            </button>

            <button onClick={() => setIsFullscreen(!isFullscreen)} title="Toggle Fullscreen" className="p-1.5 text-gray-300 hover:text-white rounded-lg">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Fixed Bottom Status Footer (shrink-0) */}
        <div className="shrink-0 flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06] text-xs text-[#6B7280] dark:text-neutral-400 font-mono bg-white dark:bg-[#090909] z-10">
          <span>Camera: X:{cameraX.toFixed(0)} Y:{cameraY.toFixed(0)} Zoom:{(cameraZoom * 100).toFixed(0)}%</span>
          <span>Hold Space + Drag to Pan | Double-Click Node to Fly-To</span>
        </div>
      </div>

      {/* Right Graph Node Inspector Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.aside
            key="graph-inspector-v4"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="w-[340px] border-l border-[#E5E7EB] dark:border-white/[0.08] bg-white dark:bg-[#141519] p-4 flex flex-col justify-between h-full shrink-0 select-none font-sans text-[#111827] dark:text-neutral-100 shadow-xl dark:shadow-none"
          >
            {/* Header */}
            <div className="shrink-0 space-y-3 pb-2 border-b border-[#E5E7EB] dark:border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#111827] dark:text-white font-bold text-sm">
                  <Network className="w-4 h-4 text-[#2563EB]" />
                  <span>Node Inspector</span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg text-[#6B7280] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20">
                  {selectedNode.type}
                </span>

                <button
                  onClick={() => flyToNode(selectedNode)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors flex items-center gap-1"
                >
                  <Target className="w-3 h-3" />
                  <span>Fly To Node</span>
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-2 text-xs">
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-[#111827] dark:text-white leading-snug">{selectedNode.title}</h3>
                <p className="text-xs text-[#6B7280] dark:text-neutral-400 bg-[#F6F7F9] dark:bg-[#111111] p-3 rounded-xl border border-[#E5E7EB] dark:border-white/[0.04]">
                  {selectedNode.content || 'Enterprise knowledge node linked in memory topology.'}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06]">
                <h4 className="text-[10px] font-mono uppercase text-[#6B7280] dark:text-neutral-500 font-semibold">Node Specs</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] dark:text-neutral-400">Node ID</span>
                    <span className="font-mono text-[#2563EB] dark:text-blue-300 font-bold">{selectedNode.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] dark:text-neutral-400">Sub-Category</span>
                    <span className="font-semibold text-[#111827] dark:text-neutral-200">{selectedNode.subType || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] dark:text-neutral-400">Workspace</span>
                    <span className="font-mono text-[#111827] dark:text-neutral-300">{selectedNode.workspace || 'Development'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] dark:text-neutral-400">Focus Depth</span>
                    <span className="font-mono text-purple-400 font-bold">D{focusDepth} Hops</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="shrink-0 pt-3 border-t border-[#E5E7EB] dark:border-white/[0.06]">
              <Link
                href={selectedNode.type === 'knowledge' ? '/knowledge' : selectedNode.type === 'project' ? '/projects' : '/memory'}
                className="h-[38px] w-full bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-none"
              >
                <span>Open Entity Module</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
