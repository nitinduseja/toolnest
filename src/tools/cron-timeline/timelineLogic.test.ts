import { describe, it, expect } from 'vitest';
import {
  generateJobRuns,
  detectCollisions,
  calculateHourlyDensity,
  calculateTimelineStats,
  exportCrontabFormat,
  parseCrontabInput,
} from './timelineLogic';
import { CronJobItem } from './types';

describe('timelineLogic', () => {
  const sampleJobs: CronJobItem[] = [
    {
      id: 'job-1',
      name: 'DB Backup',
      expression: '0 2 * * *',
      color: '#6366F1',
      enabled: true,
      command: 'pg_dump db',
    },
    {
      id: 'job-2',
      name: 'Log Rotate',
      expression: '0 2 * * *',
      color: '#EC4899',
      enabled: true,
      command: 'logrotate',
    },
    {
      id: 'job-3',
      name: 'Hourly Sync',
      expression: '0 * * * *',
      color: '#10B981',
      enabled: true,
    },
  ];

  it('generates chronological runs across multiple active jobs', () => {
    const range = {
      start: new Date('2026-11-15T00:00:00Z'),
      end: new Date('2026-11-15T05:00:00Z'),
    };
    const runs = generateJobRuns(sampleJobs, range, 'UTC');
    expect(runs.length).toBeGreaterThan(0);
    // Chronologically sorted
    for (let i = 1; i < runs.length; i += 1) {
      expect(runs[i].timestamp).toBeGreaterThanOrEqual(runs[i - 1].timestamp);
    }
  });

  it('detects collisions when multiple jobs fire at the exact same minute', () => {
    const range = {
      start: new Date('2026-11-15T01:00:00Z'),
      end: new Date('2026-11-15T03:00:00Z'),
    };
    const runs = generateJobRuns(sampleJobs, range, 'UTC');
    const jobMap = new Map(sampleJobs.map((j) => [j.id, j]));
    const collisions = detectCollisions(runs, jobMap);

    expect(collisions.length).toBe(1); // At 02:00, job-1, job-2, and job-3 all run!
    expect(collisions[0].jobs.length).toBe(3);
  });

  it('calculates 24-hour density distribution correctly', () => {
    const range = {
      start: new Date('2026-11-15T00:00:00Z'),
      end: new Date('2026-11-15T23:59:59Z'),
    };
    const runs = generateJobRuns(sampleJobs, range, 'UTC');
    const density = calculateHourlyDensity(runs);
    expect(density.length).toBe(24);
  });

  it('calculates comprehensive timeline statistics', () => {
    const runs24h = generateJobRuns(
      sampleJobs,
      {
        start: new Date('2026-11-15T00:00:00Z'),
        end: new Date('2026-11-15T23:59:59Z'),
      },
      'UTC'
    );
    const runs7d = generateJobRuns(
      sampleJobs,
      {
        start: new Date('2026-11-15T00:00:00Z'),
        end: new Date('2026-11-22T00:00:00Z'),
      },
      'UTC'
    );
    const jobMap = new Map(sampleJobs.map((j) => [j.id, j]));
    const collisions = detectCollisions(runs24h, jobMap);

    const stats = calculateTimelineStats({
      jobs: sampleJobs,
      runs24h,
      runs7d,
      collisions,
    });

    expect(stats.totalJobs).toBe(3);
    expect(stats.activeJobs).toBe(3);
    expect(stats.runs24h).toBeGreaterThan(0);
    expect(stats.runs7d).toBeGreaterThan(stats.runs24h);
  });

  it('exports crontab format with names and commands', () => {
    const output = exportCrontabFormat(sampleJobs);
    expect(output).toContain('# DB Backup');
    expect(output).toContain('0 2 * * * pg_dump db');
  });

  it('imports and parses crontab strings into jobs', () => {
    const raw = `
# Nightly Sync
0 3 * * * /scripts/sync.sh
# Cache Flush
*/10 * * * * /bin/flush
`;
    const parsed = parseCrontabInput(raw);
    expect(parsed.length).toBe(2);
    expect(parsed[0].name).toBe('Nightly Sync');
    expect(parsed[0].expression).toBe('0 3 * * *');
    expect(parsed[0].command).toBe('/scripts/sync.sh');
  });
});
