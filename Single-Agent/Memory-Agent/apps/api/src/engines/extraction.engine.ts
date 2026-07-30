export interface ExtractedKnowledge {
  people: string[];
  organizations: string[];
  technologies: string[];
  dates: string[];
  tasks: string[];
  decisions: string[];
}

export function extractKnowledgeMetadata(content: string): ExtractedKnowledge {
  const technologies = ['PostgreSQL', 'SQLite', 'Redis', 'Docker', 'Next.js', 'Express', 'Drizzle', 'Gemini', 'Vitest', 'TypeScript', 'Tailwind'];
  const foundTechs = technologies.filter((t) => content.toLowerCase().includes(t.toLowerCase()));

  // Extract task patterns (e.g., TODO, Task:, Action:)
  const tasks: string[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    if (/todo|task:|action:/i.test(line)) {
      tasks.push(line.trim());
    }
  }

  return {
    people: [],
    organizations: ['Antigravity AI'],
    technologies: foundTechs,
    dates: [new Date().toISOString().split('T')[0]],
    tasks,
    decisions: [],
  };
}
