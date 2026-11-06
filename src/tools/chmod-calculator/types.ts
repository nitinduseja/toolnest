export type PermissionRole = 'owner' | 'group' | 'others';
export type PermissionAction = 'read' | 'write' | 'execute';

export interface RolePermissions {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface SpecialPermissions {
  setuid: boolean;
  setgid: boolean;
  sticky: boolean;
}

export interface ChmodState {
  owner: RolePermissions;
  group: RolePermissions;
  others: RolePermissions;
  special: SpecialPermissions;
  isDirectory: boolean;
}

export interface ChmodPreset {
  id: string;
  name: string;
  octal: string;
  symbolic: string;
  description: string;
  isWarning?: boolean;
}

export interface CommandOptions {
  path: string;
  recursive: boolean;
  verbose: boolean;
  changesOnly: boolean;
  silent: boolean;
  sudo: boolean;
}

export interface GeneratedCommands {
  octalCommand: string;
  symbolicCommand: string;
  findCommand: string;
}

export interface RoleExplanation {
  role: string;
  description: string;
  canRead: boolean;
  canWrite: boolean;
  canExecute: boolean;
}

export interface PermissionAudit {
  explanations: RoleExplanation[];
  warnings: string[];
  recommendations: string[];
}
