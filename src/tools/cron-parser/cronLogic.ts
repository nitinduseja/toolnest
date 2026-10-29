/**
 * Pure domain logic for parsing, humanizing, and predicting Cron expressions.
 * Conforms to standard 5-part POSIX crontab specification.
 */

export interface ParsedCron {
  valid: boolean;
  minutes: Set<number>;
  hours: Set<number>;
  daysOfMonth: Set<number>;
  months: Set<number>;
  daysOfWeek: Set<number>;
  rawParts: [string, string, string, string, string];
  humanDescription: string;
  error?: string;
}

export interface CronPreset {
  label: string;
  expression: string;
  description: string;
}

const MACRO_MAP: Record<string, string> = Object.fromEntries([
  ['@yearly', '0 0 1 1 *'],
  ['@annually', '0 0 1 1 *'],
  ['@monthly', '0 0 1 * *'],
  ['@weekly', '0 0 * * 0'],
  ['@daily', '0 0 * * *'],
  ['@midnight', '0 0 * * *'],
  ['@hourly', '0 * * * *'],
]);

const MONTH_NAMES_LIST = 'JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC'.split(',');
const DAY_NAMES_LIST = 'SUN,MON,TUE,WED,THU,FRI,SAT'.split(',');

const MONTH_MAP: Record<string, string> = Object.fromEntries(
  MONTH_NAMES_LIST.map((m, i) => [m, String(i + 1)])
);

const DAY_MAP: Record<string, string> = Object.fromEntries(
  DAY_NAMES_LIST.map((d, i) => [d, String(i)])
);

const MONTH_NAMES =
  ',January,February,March,April,May,June,July,August,September,October,November,December'.split(
    ','
  );

const DAY_NAMES = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

function normalizeNames(val: string, map: Record<string, string>): string {
  let res = val.toUpperCase();
  for (const [name, num] of Object.entries(map)) {
    res = res.replace(new RegExp(name, 'g'), num);
  }
  return res;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function parseRange(part: string, min: number, max: number): number[] {
  const [rangePart, stepPart] = part.split('/');
  const step = stepPart ? parseInt(stepPart, 10) : 1;
  if (isNaN(step) || step <= 0) return [];

  let start = min;
  let end = max;
  if (rangePart !== '*') {
    if (rangePart.includes('-')) {
      const [s, e] = rangePart.split('-');
      start = parseInt(s, 10);
      end = parseInt(e, 10);
    } else {
      start = parseInt(rangePart, 10);
      end = stepPart ? max : start;
    }
  }

  if (isNaN(start) || isNaN(end) || start > end || start < min || end > max) return [];
  const vals: number[] = [];
  for (let i = start; i <= end; i += step) {
    vals.push(i);
  }
  return vals;
}

export function parseField(field: string, min: number, max: number): Set<number> {
  const parts = field.split(',');
  const res = new Set<number>();
  for (const p of parts) {
    const vals = parseRange(p.trim(), min, max);
    for (const v of vals) res.add(v);
  }
  return res;
}

function describeTime(minStr: string, hrStr: string): string {
  if (minStr === '*' && hrStr === '*') return 'At every minute';
  if (minStr.startsWith('*/') && hrStr === '*') {
    const step = parseInt(minStr.replace('*/', ''), 10);
    return `At every ${getOrdinal(step)} minute`;
  }
  if (minStr === '0' && hrStr === '*') return 'At minute 0';
  if (minStr === '0' && hrStr === '0') return 'At 00:00';
  if (minStr === '0' && hrStr === '12') return 'At 12:00';

  const pad = (n: number | string) => String(n).padStart(2, '0');
  if (
    !minStr.includes('*') &&
    !minStr.includes('/') &&
    !hrStr.includes('*') &&
    !hrStr.includes('/')
  ) {
    return `At ${pad(hrStr)}:${pad(minStr)}`;
  }
  if (hrStr.startsWith('*/')) {
    const step = parseInt(hrStr.replace('*/', ''), 10);
    return `At minute ${minStr} past every ${getOrdinal(step)} hour`;
  }
  return `At minute ${minStr} past hour ${hrStr}`;
}

function formatDow(dowStr: string): string {
  if (dowStr === '1-5') return 'every day-of-week from Monday through Friday';
  if (dowStr === '0,6' || dowStr === '6,0') return 'every day-of-week on Saturday and Sunday';
  const num = parseInt(dowStr, 10);
  if (!isNaN(num) && DAY_NAMES[num]) return DAY_NAMES[num];
  return `day-of-week ${dowStr}`;
}

function describeDays(domStr: string, dowStr: string): string {
  let res = '';
  if (domStr !== '*') {
    if (domStr.includes('-')) {
      const [s, e] = domStr.split('-');
      res = `on every day-of-month from ${s} through ${e}`;
    } else {
      res = `on day-of-month ${domStr}`;
    }
  }

  if (dowStr !== '*') {
    const dowText = formatDow(dowStr);
    res = res ? `${res} and on ${dowText}` : `on ${dowText}`;
  }
  return res;
}

function describeMonth(monStr: string): string {
  if (monStr === '*') return '';
  const num = parseInt(monStr, 10);
  if (!isNaN(num) && MONTH_NAMES[num]) {
    return `in ${MONTH_NAMES[num]}`;
  }
  return `in month ${monStr}`;
}

export function humanizeCron(parts: [string, string, string, string, string]): string {
  const [min, hr, dom, mon, dow] = parts;
  const timeDesc = describeTime(min, hr);
  const dayDesc = describeDays(dom, dow);
  const monDesc = describeMonth(mon);

  const partsList = [timeDesc, dayDesc, monDesc].filter(Boolean);
  return `${partsList.join(' ')}.`;
}

export function parseCron(expr: string): ParsedCron {
  const trimmed = expr.trim();
  const effectiveExpr = MACRO_MAP[trimmed.toLowerCase()] || trimmed;
  const rawParts = effectiveExpr.split(/\s+/) as [string, string, string, string, string];

  if (!effectiveExpr || rawParts.length !== 5) {
    return {
      valid: false,
      minutes: new Set(),
      hours: new Set(),
      daysOfMonth: new Set(),
      months: new Set(),
      daysOfWeek: new Set(),
      rawParts: ['', '', '', '', ''],
      humanDescription: '',
      error: 'Invalid expression. Standard cron requires 5 fields or a macro (e.g. @daily).',
    };
  }

  const [minStr, hrStr, domStr, monStr, dowStr] = rawParts;
  const minutes = parseField(minStr, 0, 59);
  const hours = parseField(hrStr, 0, 23);
  const daysOfMonth = parseField(domStr, 1, 31);
  const months = parseField(normalizeNames(monStr, MONTH_MAP), 1, 12);
  const daysOfWeek = parseField(normalizeNames(dowStr, DAY_MAP).replace(/7/g, '0'), 0, 6);

  const isValid =
    minutes.size > 0 &&
    hours.size > 0 &&
    daysOfMonth.size > 0 &&
    months.size > 0 &&
    daysOfWeek.size > 0;

  return {
    valid: isValid,
    minutes,
    hours,
    daysOfMonth,
    months,
    daysOfWeek,
    rawParts,
    humanDescription: isValid ? humanizeCron(rawParts) : '',
    error: isValid ? undefined : 'Invalid values in one or more cron fields.',
  };
}

function isDayMatch(p: ParsedCron, dom: number, dow: number): boolean {
  const isDomWild = p.rawParts[2] === '*';
  const isDowWild = p.rawParts[4] === '*';
  if (isDomWild && isDowWild) return true;
  if (!isDomWild && !isDowWild) return p.daysOfMonth.has(dom) || p.daysOfWeek.has(dow);
  if (!isDomWild) return p.daysOfMonth.has(dom);
  return p.daysOfWeek.has(dow);
}

export function getNextRuns(p: ParsedCron, count = 5, startFrom = new Date()): Date[] {
  if (!p.valid) return [];
  const runs: Date[] = [];
  const cursor = new Date(startFrom.getTime());
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  let iter = 0;
  while (runs.length < count && iter < 10000) {
    iter += 1;
    const mon = cursor.getMonth() + 1;
    if (!p.months.has(mon)) {
      cursor.setMonth(cursor.getMonth() + 1, 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }
    const dom = cursor.getDate();
    const dow = cursor.getDay();
    if (!isDayMatch(p, dom, dow)) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }
    const hr = cursor.getHours();
    if (!p.hours.has(hr)) {
      cursor.setHours(cursor.getHours() + 1, 0, 0, 0);
      continue;
    }
    const min = cursor.getMinutes();
    if (!p.minutes.has(min)) {
      cursor.setMinutes(cursor.getMinutes() + 1);
      continue;
    }
    runs.push(new Date(cursor.getTime()));
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return runs;
}

export function getCronPresets(): CronPreset[] {
  return [
    { label: 'Every minute', expression: '* * * * *', description: 'Executes every minute' },
    {
      label: 'Every 5 minutes',
      expression: '*/5 * * * *',
      description: 'Executes every 5 minutes',
    },
    { label: 'Hourly', expression: '0 * * * *', description: 'Executes at minute 0 of every hour' },
    { label: 'Daily at midnight', expression: '0 0 * * *', description: 'Executes daily at 00:00' },
    { label: 'Daily at noon', expression: '0 12 * * *', description: 'Executes daily at 12:00' },
    {
      label: 'Weekdays at 9am',
      expression: '0 9 * * 1-5',
      description: 'Monday to Friday at 09:00',
    },
    { label: 'Weekly on Sunday', expression: '0 0 * * 0', description: 'Every Sunday at midnight' },
    {
      label: 'First of month',
      expression: '0 0 1 * *',
      description: '1st of every month at midnight',
    },
  ];
}
