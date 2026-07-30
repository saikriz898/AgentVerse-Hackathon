export interface HistoryEvent {
  id: string;
  type: 'simplifier' | 'report' | 'email';
  title: string;
  timestamp: string;
  details: string;
  preview: string;
  badge: string;
}

export const logCommunicationEvent = (event: Omit<HistoryEvent, 'id' | 'timestamp'>) => {
  const newRecord: HistoryEvent = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  try {
    const existing = localStorage.getItem('lifeos_comm_history');
    const logs: HistoryEvent[] = existing ? JSON.parse(existing) : [];
    const updated = [newRecord, ...logs];
    localStorage.setItem('lifeos_comm_history', JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to log history event:', err);
  }
};
