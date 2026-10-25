export type TimestampUnit = 'seconds' | 'milliseconds';

export interface TimestampDetails {
  isValid: boolean;
  error?: string;
  seconds: number;
  milliseconds: number;
  iso: string;
  utc: string;
  local: string;
}

export function parseTimestamp(
  val: number | string,
  unit: TimestampUnit = 'seconds'
): TimestampDetails {
  const num = typeof val === 'string' ? Number(val.trim()) : val;

  if (isNaN(num)) {
    return {
      isValid: false,
      error: 'Invalid numeric timestamp',
      seconds: 0,
      milliseconds: 0,
      iso: '',
      utc: '',
      local: '',
    };
  }

  const ms = unit === 'seconds' ? num * 1000 : num;
  const date = new Date(ms);

  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Timestamp out of valid date range',
      seconds: 0,
      milliseconds: 0,
      iso: '',
      utc: '',
      local: '',
    };
  }

  return {
    isValid: true,
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
  };
}

export function parseIsoDate(dateString: string): TimestampDetails {
  const trimmed = dateString.trim();
  const date = new Date(trimmed);

  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format',
      seconds: 0,
      milliseconds: 0,
      iso: '',
      utc: '',
      local: '',
    };
  }

  const ms = date.getTime();
  return {
    isValid: true,
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
  };
}
