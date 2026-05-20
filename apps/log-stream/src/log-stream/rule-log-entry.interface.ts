export interface RuleLogEntry {
  ruleId: number;
  userId: number;
  runId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  type: 'text' | 'json';
  message?: string;
  data?: Record<string, unknown>;
}
