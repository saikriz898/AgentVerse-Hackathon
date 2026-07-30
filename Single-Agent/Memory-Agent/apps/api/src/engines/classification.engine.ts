export type MemoryCategory =
  | 'conversation'
  | 'project'
  | 'knowledge'
  | 'document'
  | 'preference'
  | 'task'
  | 'meeting'
  | 'idea'
  | 'research'
  | 'code'
  | 'decision'
  | 'bug'
  | 'feature';

export interface ClassificationResult {
  category: MemoryCategory;
  confidence: number; // [0, 1]
  tags: string[];
}

export function classifyMemoryContent(content: string, title = ''): ClassificationResult {
  const text = (title + ' ' + content).toLowerCase();

  if (text.includes('bug') || text.includes('error') || text.includes('fix') || text.includes('issue')) {
    return { category: 'bug', confidence: 0.9, tags: ['bug-report', 'issue'] };
  }
  if (text.includes('feature') || text.includes('implement') || text.includes('enhance')) {
    return { category: 'feature', confidence: 0.88, tags: ['feature', 'enhancement'] };
  }
  if (text.includes('function') || text.includes('const ') || text.includes('import ') || text.includes('class ')) {
    return { category: 'code', confidence: 0.95, tags: ['source-code', 'implementation'] };
  }
  if (text.includes('meeting') || text.includes('notes') || text.includes('attendees')) {
    return { category: 'meeting', confidence: 0.92, tags: ['meeting-notes'] };
  }
  if (text.includes('decide') || text.includes('approved') || text.includes('architecture decision')) {
    return { category: 'decision', confidence: 0.85, tags: ['architecture', 'decision'] };
  }

  return { category: 'knowledge', confidence: 0.75, tags: ['knowledge-base'] };
}
