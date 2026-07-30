export interface MemoryInsight {
  totalMemoriesCount: number;
  trendingCategories: string[];
  knowledgeGaps: string[];
  recommendation: string;
}

export function generateWorkspaceInsights(memories: Array<{ type: string; title: string }>): MemoryInsight {
  const typeCounts: Record<string, number> = {};
  for (const m of memories) {
    typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
  }

  const trendingCategories = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]);
  const knowledgeGaps: string[] = [];

  if (!typeCounts['project']) {
    knowledgeGaps.push('No project workspace memories indexed');
  }
  if (!typeCounts['conversation']) {
    knowledgeGaps.push('No recent conversation stream summaries recorded');
  }

  return {
    totalMemoriesCount: memories.length,
    trendingCategories,
    knowledgeGaps,
    recommendation: 'Index additional project reference documents to enhance RRF search coverage.',
  };
}
