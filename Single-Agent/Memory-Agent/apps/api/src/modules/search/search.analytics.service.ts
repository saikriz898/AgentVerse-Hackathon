interface SearchRecord {
  workspaceId: string;
  query: string;
  resultsCount: number;
  latencyMs: number;
  timestamp: string;
}

export class SearchAnalyticsService {
  private history: SearchRecord[] = [];

  logSearch(workspaceId: string, query: string, resultsCount: number, latencyMs: number) {
    this.history.push({
      workspaceId,
      query,
      resultsCount,
      latencyMs,
      timestamp: new Date().toISOString(),
    });
  }

  getWorkspaceHistory(workspaceId: string, limit = 20): SearchRecord[] {
    return this.history.filter((h) => h.workspaceId === workspaceId).slice(-limit).reverse();
  }

  getWorkspaceAnalytics(workspaceId: string) {
    const logs = this.history.filter((h) => h.workspaceId === workspaceId);
    const totalSearches = logs.length;
    const avgLatencyMs = totalSearches > 0 ? Math.round(logs.reduce((acc, curr) => acc + curr.latencyMs, 0) / totalSearches) : 0;

    const queryCounts: Record<string, number> = {};
    for (const l of logs) {
      queryCounts[l.query] = (queryCounts[l.query] || 0) + 1;
    }
    const topQueries = Object.keys(queryCounts).sort((a, b) => queryCounts[b] - queryCounts[a]).slice(0, 5);

    return {
      totalSearches,
      avgLatencyMs,
      topQueries,
    };
  }
}

export const searchAnalyticsService = new SearchAnalyticsService();
