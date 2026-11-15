import { MultiCronPreset } from './types';

export const JOB_COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#EF4444', // Red
  '#F97316', // Orange
  '#06B6D4', // Cyan
];

export const TIMEZONE_OPTIONS = [
  { label: 'Local (Browser)', value: 'local', offsetLabel: 'System' },
  { label: 'UTC (Universal Coordinated)', value: 'UTC', offsetLabel: '+00:00' },
  { label: 'New York (US Eastern)', value: 'America/New_York', offsetLabel: 'EST/EDT' },
  { label: 'Los Angeles (US Pacific)', value: 'America/Los_Angeles', offsetLabel: 'PST/PDT' },
  { label: 'London (GMT / BST)', value: 'Europe/London', offsetLabel: 'GMT/BST' },
  { label: 'Frankfurt / Paris (CET)', value: 'Europe/Berlin', offsetLabel: 'CET/CEST' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo', offsetLabel: '+09:00' },
  { label: 'India (IST)', value: 'Asia/Kolkata', offsetLabel: '+05:30' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney', offsetLabel: '+10:00' },
];

export const PRESET_SUITES: MultiCronPreset[] = [
  {
    id: 'backend-ops',
    name: 'E-commerce & Web App Ops',
    description: 'Typical production web service cron schedule suite.',
    jobs: [
      {
        name: 'Database Backup',
        expression: '0 2 * * *',
        color: '#6366F1',
        enabled: true,
        command: '/usr/local/bin/pg_dump -Fc prod_db > /backups/db.dump',
      },
      {
        name: 'Abandoned Cart Emailer',
        expression: '*/30 8-20 * * *',
        color: '#EC4899',
        enabled: true,
        command: 'php artisan emails:send-abandoned-carts',
      },
      {
        name: 'Session & Cache Prune',
        expression: '0 * * * *',
        color: '#10B981',
        enabled: true,
        command: 'redis-cli -a $AUTH eval "return redis.call(\'flushdb\')" 0',
      },
      {
        name: 'Weekly Invoicing & Statements',
        expression: '0 4 * * 1',
        color: '#F59E0B',
        enabled: true,
        command: 'node /app/scripts/generate-weekly-invoices.js',
      },
      {
        name: 'Health Pulse Ping',
        expression: '*/15 * * * *',
        color: '#3B82F6',
        enabled: true,
        command: 'curl -fsS https://status.example.com/heartbeat > /dev/null',
      },
    ],
  },
  {
    id: 'data-etl',
    name: 'Data Warehouse ETL Pipeline',
    description: 'Staged data extraction, transformation, and cube refresh schedule.',
    jobs: [
      {
        name: 'Raw Ingestion (Staging)',
        expression: '15 * * * *',
        color: '#3B82F6',
        enabled: true,
        command: 'python /etl/ingest_stream.py --source=kafka',
      },
      {
        name: 'Nightly Warehouse Sync',
        expression: '0 3 * * *',
        color: '#8B5CF6',
        enabled: true,
        command: 'dbt run --models staging+ warehouse+',
      },
      {
        name: 'Daily Cube Aggregations',
        expression: '45 3 * * *',
        color: '#10B981',
        enabled: true,
        command: 'spark-submit /jobs/aggregate_daily_metrics.py',
      },
      {
        name: 'Monthly Analytics Rollup',
        expression: '0 5 1 * *',
        color: '#EF4444',
        enabled: true,
        command: 'dbt run --models monthly_financials',
      },
    ],
  },
  {
    id: 'system-maintenance',
    name: 'DevOps System Maintenance',
    description: 'System-level hygiene, cert renewals, and log rotations.',
    jobs: [
      {
        name: "Let's Encrypt Cert Renewal",
        expression: '0 0 1,15 * *',
        color: '#14B8A6',
        enabled: true,
        command: 'certbot renew --quiet',
      },
      {
        name: 'Logrotate Daily',
        expression: '0 0 * * *',
        color: '#F97316',
        enabled: true,
        command: '/usr/sbin/logrotate /etc/logrotate.conf',
      },
      {
        name: 'Disk Usage & Alert Check',
        expression: '0 */4 * * *',
        color: '#06B6D4',
        enabled: true,
        command: '/usr/local/bin/check_disk.sh --threshold=85%',
      },
    ],
  },
];
