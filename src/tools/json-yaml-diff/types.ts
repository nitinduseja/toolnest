export type DiffOp = 'add' | 'remove' | 'replace';

export interface DiffEntry {
  path: string;
  op: DiffOp;
  oldValue?: unknown;
  newValue?: unknown;
}

export interface JsonPatchOperation {
  op: 'add' | 'remove' | 'replace';
  path: string;
  value?: unknown;
}

export interface DiffSummary {
  added: number;
  removed: number;
  replaced: number;
  total: number;
}
