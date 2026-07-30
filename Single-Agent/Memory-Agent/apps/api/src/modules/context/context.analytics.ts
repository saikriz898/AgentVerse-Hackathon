interface ContextMetrics {
  workspaceId: string;
  query: string;
  tokenCount: number;
  memoryCount: number;
  buildTimeMs: number;
  timestamp: string;
}

export class ContextAnalytics {
  private metrics: ContextMetrics[] = [];

  logContextBuild(workspaceId: string, query: string, tokenCount: number, memoryCount: number, buildTimeMs: number) {
    this.metrics.push({
      workspaceId,
      query,
      tokenCount,
      memoryCount,
      buildTimeMs,
      timestamp: new Date().toISOString(),
    });
  }

  getWorkspaceMetrics(workspaceId: string) {
    const logs = this.metrics.filter((m) => m.workspaceId === workspaceId);
    const totalBuilds = logs.length;
    const avgTokenCount = totalBuilds > 0 ? Math.round(logs.reduce((a, b) => a + b.tokenCount, 0) / totalBuilds) : 0;
    const avgBuildTimeMs = totalBuilds > 0 ? Math.round(logs.reduce((a, b) => a + b.buildTimeMs, 0) / totalBuilds) : 0;

    return {
      totalBuilds,
      avgTokenCount,
      avgBuildTimeMs,
      recentLogs: logs.slice(-10).reverse(),
    };
  }
}

export const contextAnalytics = new ContextAnalytics();
