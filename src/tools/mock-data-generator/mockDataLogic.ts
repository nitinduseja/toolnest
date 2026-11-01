/**
 * Pure domain logic for client-side realistic mock data generation.
 * Generates structured JSON and CSV test datasets locally without external requests.
 */

export type FieldType =
  | 'id_uuid'
  | 'id_int'
  | 'full_name'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone'
  | 'company'
  | 'job_title'
  | 'country'
  | 'city'
  | 'street'
  | 'date'
  | 'boolean'
  | 'price'
  | 'status';

export interface FieldConfig {
  id: string;
  name: string;
  type: FieldType;
}

export interface PresetSchema {
  name: string;
  description: string;
  fields: FieldConfig[];
}

export const FIELD_TYPE_OPTIONS: { value: FieldType; label: string }[] = [
  { value: 'id_uuid', label: 'UUID (v4)' },
  { value: 'id_int', label: 'ID (Integer)' },
  { value: 'full_name', label: 'Full Name' },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'email', label: 'Email Address' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'company', label: 'Company Name' },
  { value: 'job_title', label: 'Job Title' },
  { value: 'country', label: 'Country' },
  { value: 'city', label: 'City' },
  { value: 'street', label: 'Street Address' },
  { value: 'date', label: 'ISO Date' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'price', label: 'Price' },
  { value: 'status', label: 'Status' },
];

const FIRST_NAMES = [
  'Alex',
  'Jordan',
  'Taylor',
  'Morgan',
  'Casey',
  'Sam',
  'Riley',
  'Avery',
  'Elena',
  'Liam',
  'Marcus',
  'Chloe',
  'Sofia',
  'David',
  'Maya',
  'Lucas',
];

const LAST_NAMES = [
  'Vance',
  'Sterling',
  'Chen',
  'Novak',
  'Kim',
  "O'Connor",
  'Patel',
  'Dubois',
  'Moreno',
  'Rossi',
  'Silva',
  'Tanaka',
  'Muller',
  'Santos',
  'Fischer',
  'Wright',
];

const COMPANIES = [
  'Acme Technologies',
  'Apex Cloud',
  'Starlight Systems',
  'Nexus Dynamics',
  'Vortex Labs',
  'Cyberdyne',
  'Umbrella Solutions',
  'Pinnacle Analytics',
];

const JOB_TITLES = [
  'Senior Software Engineer',
  'Product Designer',
  'DevOps Specialist',
  'Data Scientist',
  'Technical Lead',
  'Product Manager',
  'QA Architect',
];

const CITIES = [
  'San Francisco',
  'Berlin',
  'Tokyo',
  'London',
  'Toronto',
  'Sydney',
  'Singapore',
  'Stockholm',
];

const COUNTRIES = [
  'United States',
  'Germany',
  'Japan',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  'Sweden',
];

const STATUSES = ['active', 'pending', 'inactive', 'verified', 'completed'];

function pick<T>(arr: T[], idx: number): T {
  return arr[Math.abs(idx) % arr.length];
}

function generateUuid(seedVal: number): string {
  const h1 = ((Math.imul(seedVal + 1, 1664525) + 1013904223) >>> 0).toString(16).padStart(8, '0');
  const h2 = ((Math.imul(seedVal + 2, 22695477) + 1) >>> 0).toString(16).padStart(8, '0');
  const h3 = ((Math.imul(seedVal + 3, 1103515245) + 12345) >>> 0).toString(16).padStart(8, '0');
  const h4 = ((Math.imul(seedVal + 4, 134775813) + 1) >>> 0).toString(16).padStart(8, '0');
  return `${h1}-${h2.slice(0, 4)}-4${h2.slice(5, 8)}-a${h3.slice(1, 4)}-${h3.slice(4, 8)}${h4.slice(0, 8)}`;
}

function generatePersonField(type: FieldType, effIdx: number, seed: number): unknown {
  const first = pick(FIRST_NAMES, effIdx);
  const last = pick(LAST_NAMES, effIdx + 3);
  const cleanLast = last.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (type === 'first_name') return first;
  if (type === 'last_name') return last;
  if (type === 'full_name') return `${first} ${last}`;
  if (type === 'email') return `${first.toLowerCase()}.${cleanLast}@example.com`;
  if (type === 'company') return pick(COMPANIES, effIdx);
  if (type === 'job_title') return pick(JOB_TITLES, effIdx);

  const area = seed > 0 ? 200 + ((effIdx * 37) % 700) : 555;
  const mid = 100 + ((effIdx * 41) % 900);
  const end = 1000 + ((effIdx * 83) % 9000);
  return `+1 (${area}) ${String(mid).padStart(3, '0')}-${String(end).padStart(4, '0')}`;
}

function generateLocationField(type: FieldType, effIdx: number, seed: number): unknown {
  if (type === 'city') return pick(CITIES, effIdx);
  if (type === 'country') return pick(COUNTRIES, effIdx);
  const num = 100 + ((effIdx * 19 + seed * 29) % 899);
  const suite = ((effIdx + seed) % 15) + 1;
  return `${num} Market Street, Suite ${suite}00`;
}

export function generateFieldValue(type: FieldType, idx: number, seed = 0): unknown {
  const effIdx = idx + seed * 7;
  if (
    ['first_name', 'last_name', 'full_name', 'email', 'phone', 'company', 'job_title'].includes(
      type
    )
  ) {
    return generatePersonField(type, effIdx, seed);
  }
  if (['city', 'country', 'street'].includes(type)) {
    return generateLocationField(type, effIdx, seed);
  }
  if (type === 'id_uuid') return generateUuid(effIdx + 100);
  if (type === 'id_int') return seed > 0 ? seed * 100 + idx + 1 : idx + 1;
  if (type === 'boolean') return (effIdx + seed) % 2 === 0;
  if (type === 'price')
    return Number(Math.max(4.99, (effIdx * 23.45 + seed * 17.89 + 14.99) % 490).toFixed(2));
  if (type === 'status') return pick(STATUSES, effIdx + seed);
  if (type === 'date') {
    const d = new Date(
      Date.UTC(
        2026,
        (effIdx + seed) % 12,
        ((effIdx + seed * 3) % 28) + 1,
        (effIdx * 2 + seed) % 24,
        (effIdx * 5 + seed * 7) % 60
      )
    );
    return d.toISOString();
  }
  return `Value ${effIdx + 1}`;
}

export function generateMockDataset(
  fields: FieldConfig[],
  count: number,
  seed = 0
): Record<string, unknown>[] {
  const safeCount = Math.max(1, Math.min(count, 500));
  const rows: Record<string, unknown>[] = [];

  for (let i = 0; i < safeCount; i += 1) {
    const row: Record<string, unknown> = {};
    for (const field of fields) {
      row[field.name || `field_${field.id}`] = generateFieldValue(field.type, i, seed);
    }
    rows.push(row);
  }
  return rows;
}

export function exportToJson(dataset: Record<string, unknown>[]): string {
  return JSON.stringify(dataset, null, 2);
}

function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '';
  const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv(dataset: Record<string, unknown>[]): string {
  if (dataset.length === 0) return '';
  const headers = Object.keys(dataset[0]);
  const lines: string[] = [headers.map(escapeCsvCell).join(',')];

  for (const row of dataset) {
    const line = headers.map((h) => escapeCsvCell(row[h])).join(',');
    lines.push(line);
  }
  return lines.join('\n');
}

export function getPresetSchemas(): PresetSchema[] {
  return [
    {
      name: 'User Profiles',
      description: 'Standard user entity with UUID, name, email, role, and registration date',
      fields: [
        { id: '1', name: 'id', type: 'id_uuid' },
        { id: '2', name: 'name', type: 'full_name' },
        { id: '3', name: 'email', type: 'email' },
        { id: '4', name: 'job_title', type: 'job_title' },
        { id: '5', name: 'country', type: 'country' },
        { id: '6', name: 'is_active', type: 'boolean' },
      ],
    },
    {
      name: 'E-commerce Orders',
      description: 'Order records with order ID, customer name, price, status, and purchase date',
      fields: [
        { id: '1', name: 'order_id', type: 'id_int' },
        { id: '2', name: 'customer', type: 'full_name' },
        { id: '3', name: 'total_amount', type: 'price' },
        { id: '4', name: 'status', type: 'status' },
        { id: '5', name: 'order_date', type: 'date' },
      ],
    },
    {
      name: 'Company Directory',
      description: 'B2B contacts with company, city, street, and contact phone',
      fields: [
        { id: '1', name: 'id', type: 'id_int' },
        { id: '2', name: 'company', type: 'company' },
        { id: '3', name: 'street', type: 'street' },
        { id: '4', name: 'city', type: 'city' },
        { id: '5', name: 'phone', type: 'phone' },
      ],
    },
  ];
}
