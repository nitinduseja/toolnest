export interface CronJobItem {
  id: string;
  name: string;
  expression: string;
  color: string;
  enabled: boolean;
  command?: string;
}

export interface TimelineRun {
  jobId: string;
  jobName: string;
  color: string;
  date: Date;
  timestamp: number;
  formattedTime: string;
  formattedDate: string;
  relativeTime: string;
}

export interface DensitySlot {
  hour: number;
  count: number;
  jobs: { jobId: string; jobName: string; count: number; color: string }[];
}

export interface CollisionEvent {
  timestamp: number;
  timeString: string;
  dateString: string;
  jobs: { jobId: string; jobName: string; color: string; expression: string }[];
}

export interface TimelineStats {
  totalJobs: number;
  activeJobs: number;
  runs24h: number;
  runs7d: number;
  busiestHour: number | null;
  collisionCount: number;
  shortestIntervalMinutes: number | null;
}

export type ViewHorizon = '24h' | '7d';

export interface TimezoneOption {
  label: string;
  value: string;
  offsetLabel: string;
}

export interface MultiCronPreset {
  id: string;
  name: string;
  description: string;
  jobs: Omit<CronJobItem, 'id'>[];
}
