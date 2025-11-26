export interface ReportResult {
  activity: string;
  learning: string;
  challenges: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  data: ReportResult | null;
}

export enum ReportSection {
  ACTIVITY = 'activity',
  LEARNING = 'learning',
  CHALLENGES = 'challenges',
}