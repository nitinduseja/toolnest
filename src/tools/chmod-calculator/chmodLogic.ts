import {
  ChmodState,
  RolePermissions,
  SpecialPermissions,
  CommandOptions,
  GeneratedCommands,
  PermissionAudit,
  ChmodPreset,
} from './types';

export const DEFAULT_CHMOD_STATE: ChmodState = {
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: true },
  others: { read: true, write: false, execute: true },
  special: { setuid: false, setgid: false, sticky: false },
  isDirectory: false,
};

export function calculateRoleOctal(p: RolePermissions): number {
  return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
}

export function calculateSpecialOctal(s: SpecialPermissions): number {
  return (s.setuid ? 4 : 0) + (s.setgid ? 2 : 0) + (s.sticky ? 1 : 0);
}

export function roleFromOctal(val: number): RolePermissions {
  const clamped = Math.max(0, Math.min(7, val || 0));
  return {
    read: (clamped & 4) !== 0,
    write: (clamped & 2) !== 0,
    execute: (clamped & 1) !== 0,
  };
}

export function specialFromOctal(val: number): SpecialPermissions {
  const clamped = Math.max(0, Math.min(7, val || 0));
  return {
    setuid: (clamped & 4) !== 0,
    setgid: (clamped & 2) !== 0,
    sticky: (clamped & 1) !== 0,
  };
}

export function calculateOctalString(state: ChmodState, includeLeadingZero = false): string {
  const u = calculateRoleOctal(state.owner);
  const g = calculateRoleOctal(state.group);
  const o = calculateRoleOctal(state.others);
  const s = calculateSpecialOctal(state.special);

  if (s > 0) {
    return `${s}${u}${g}${o}`;
  }
  return includeLeadingZero ? `0${u}${g}${o}` : `${u}${g}${o}`;
}

function formatRoleSymbolic(
  p: RolePermissions,
  specialFlag?: 'setuid' | 'setgid' | 'sticky'
): string {
  const r = p.read ? 'r' : '-';
  const w = p.write ? 'w' : '-';
  let x = p.execute ? 'x' : '-';

  if (specialFlag === 'setuid' || specialFlag === 'setgid') {
    x = p.execute ? 's' : 'S';
  } else if (specialFlag === 'sticky') {
    x = p.execute ? 't' : 'T';
  }

  return `${r}${w}${x}`;
}

export function calculateSymbolicString(state: ChmodState): string {
  const prefix = state.isDirectory ? 'd' : '-';
  const u = formatRoleSymbolic(state.owner, state.special.setuid ? 'setuid' : undefined);
  const g = formatRoleSymbolic(state.group, state.special.setgid ? 'setgid' : undefined);
  const o = formatRoleSymbolic(state.others, state.special.sticky ? 'sticky' : undefined);
  return `${prefix}${u}${g}${o}`;
}

function roleToRwx(p: RolePermissions): string {
  let s = '';
  if (p.read) s += 'r';
  if (p.write) s += 'w';
  if (p.execute) s += 'x';
  return s || '-';
}

export function calculateSymbolicNotation(state: ChmodState): string {
  const parts: string[] = [];
  const uStr = roleToRwx(state.owner);
  const gStr = roleToRwx(state.group);
  const oStr = roleToRwx(state.others);

  parts.push(`u=${uStr === '-' ? '' : uStr}`);
  parts.push(`g=${gStr === '-' ? '' : gStr}`);
  parts.push(`o=${oStr === '-' ? '' : oStr}`);

  if (state.special.setuid) parts.push('u+s');
  if (state.special.setgid) parts.push('g+s');
  if (state.special.sticky) parts.push('+t');

  return parts.join(',');
}

export function parseOctalInput(input: string): Partial<ChmodState> | null {
  const trimmed = input.trim();
  if (!/^[0-7]{3,4}$/.test(trimmed)) return null;

  if (trimmed.length === 3) {
    return {
      owner: roleFromOctal(parseInt(trimmed[0], 10)),
      group: roleFromOctal(parseInt(trimmed[1], 10)),
      others: roleFromOctal(parseInt(trimmed[2], 10)),
      special: { setuid: false, setgid: false, sticky: false },
    };
  }

  return {
    special: specialFromOctal(parseInt(trimmed[0], 10)),
    owner: roleFromOctal(parseInt(trimmed[1], 10)),
    group: roleFromOctal(parseInt(trimmed[2], 10)),
    others: roleFromOctal(parseInt(trimmed[3], 10)),
  };
}

export function parseSymbolicInput(input: string): Partial<ChmodState> | null {
  const trimmed = input.trim();
  let raw = trimmed;
  let isDirectory = false;

  if (raw.length === 10) {
    isDirectory = raw[0] === 'd';
    raw = raw.slice(1);
  }

  if (raw.length !== 9 || !/^[r-][w-][xSs-][r-][w-][xSs-][r-][w-][xTt-]$/.test(raw)) {
    return null;
  }

  return {
    isDirectory,
    owner: {
      read: raw[0] === 'r',
      write: raw[1] === 'w',
      execute: raw[2].toLowerCase() === 'x' || raw[2] === 's',
    },
    group: {
      read: raw[3] === 'r',
      write: raw[4] === 'w',
      execute: raw[5].toLowerCase() === 'x' || raw[5] === 's',
    },
    others: {
      read: raw[6] === 'r',
      write: raw[7] === 'w',
      execute: raw[8].toLowerCase() === 'x' || raw[8] === 't',
    },
    special: {
      setuid: raw[2].toLowerCase() === 's',
      setgid: raw[5].toLowerCase() === 's',
      sticky: raw[8].toLowerCase() === 't',
    },
  };
}

function buildFlags(opt: CommandOptions): string {
  const flags: string[] = [];
  if (opt.recursive) flags.push('R');
  if (opt.verbose) flags.push('v');
  if (opt.changesOnly) flags.push('c');
  if (opt.silent) flags.push('f');
  return flags.length ? ` -${flags.join('')}` : '';
}

export function generateChmodCommands(state: ChmodState, opt: CommandOptions): GeneratedCommands {
  const octal = calculateOctalString(state);
  const symbolic = calculateSymbolicNotation(state);
  const flags = buildFlags(opt);
  const target = opt.path.trim() || 'filename';
  const prefix = opt.sudo ? 'sudo ' : '';

  const quotedTarget = target.includes(' ') ? `"${target}"` : target;

  const typeFlag = state.isDirectory ? '-type d' : '-type f';
  const findCmd = `find ${quotedTarget} ${typeFlag} -exec chmod ${octal} {} +`;

  return {
    octalCommand: `${prefix}chmod${flags} ${octal} ${quotedTarget}`,
    symbolicCommand: `${prefix}chmod${flags} ${symbolic} ${quotedTarget}`,
    findCommand: `${prefix}${findCmd}`,
  };
}

export function auditPermissions(state: ChmodState): PermissionAudit {
  const u = calculateRoleOctal(state.owner);
  const g = calculateRoleOctal(state.group);
  const o = calculateRoleOctal(state.others);
  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (o >= 2) {
    warnings.push(
      'World-Writable (Others have write access): Any local user can overwrite or delete this file.'
    );
  }
  if (u === 7 && g === 7 && o === 7) {
    warnings.push(
      'Full 777 Access: Dangerous in production. Never grant 777 to web root, scripts, or config files.'
    );
    recommendations.push('For files, use 644 (-rw-r--r--). For directories, use 755 (drwxr-xr-x).');
  }
  if (state.special.setuid && o >= 2) {
    warnings.push(
      'Setuid on World-Writable File: High security vulnerability (potential root privilege escalation).'
    );
  }
  if (!state.owner.read && state.owner.execute) {
    warnings.push(
      'Execute without Read: Scripts (bash/python) cannot be executed if read permission is missing.'
    );
  }

  const explanations = [
    {
      role: 'Owner (User)',
      description: describeRole(state.owner, 'Owner'),
      canRead: state.owner.read,
      canWrite: state.owner.write,
      canExecute: state.owner.execute,
    },
    {
      role: 'Group',
      description: describeRole(state.group, 'Group members'),
      canRead: state.group.read,
      canWrite: state.group.write,
      canExecute: state.group.execute,
    },
    {
      role: 'Others (Public)',
      description: describeRole(state.others, 'Everyone else'),
      canRead: state.others.read,
      canWrite: state.others.write,
      canExecute: state.others.execute,
    },
  ];

  return { explanations, warnings, recommendations };
}

function describeRole(p: RolePermissions, subject: string): string {
  if (p.read && p.write && p.execute) return `${subject} can read, write/edit, and execute.`;
  if (p.read && p.write && !p.execute) return `${subject} can read and write, but cannot execute.`;
  if (p.read && !p.write && p.execute) return `${subject} can read and execute, but cannot write.`;
  if (p.read && !p.write && !p.execute) return `${subject} can only read.`;
  if (!p.read && !p.write && p.execute) return `${subject} can only execute.`;
  if (!p.read && p.write && !p.execute) return `${subject} can only write (drop-box write).`;
  return `${subject} has no permissions (access denied).`;
}

export const COMMON_CHMOD_PRESETS: ChmodPreset[] = [
  {
    id: '644',
    name: 'Standard File (644)',
    octal: '644',
    symbolic: '-rw-r--r--',
    description: 'Owner can read & write; group and others can only read. Safe default for files.',
  },
  {
    id: '755',
    name: 'Standard Executable / Dir (755)',
    octal: '755',
    symbolic: '-rwxr-xr-x',
    description:
      'Owner has full access; others can read and execute/traverse. Safe default for directories.',
  },
  {
    id: '600',
    name: 'Private File / SSH Key (600)',
    octal: '600',
    symbolic: '-rw-------',
    description:
      'Owner read/write only. Required for SSH private keys (~/.ssh/id_rsa) and .env files.',
  },
  {
    id: '700',
    name: 'Private Directory (700)',
    octal: '700',
    symbolic: 'drwx------',
    description: 'Owner full access only. Ideal for private folders (~/.ssh, ~/.gnupg).',
  },
  {
    id: '400',
    name: 'Read-Only Sensitive File (400)',
    octal: '400',
    symbolic: '-r--------',
    description: 'Owner read-only. Prevents accidental modification of sensitive certificates.',
  },
  {
    id: '664',
    name: 'Group Shared File (664)',
    octal: '664',
    symbolic: '-rw-rw-r--',
    description: 'Owner and group can edit; public can read. Standard in multi-user team repos.',
  },
  {
    id: '775',
    name: 'Group Shared Directory (775)',
    octal: '775',
    symbolic: 'drwxrwxr-x',
    description: 'Owner and group can manage files; public can traverse and read.',
  },
  {
    id: '1777',
    name: 'Sticky Temporary Directory (1777)',
    octal: '1777',
    symbolic: 'drwxrwxrwt',
    description:
      'World-writable directory where only file owners can delete their files (e.g., /tmp).',
  },
  {
    id: '777',
    name: 'Full Public Access (777)',
    octal: '777',
    symbolic: '-rwxrwxrwx',
    description: 'Read, write, and execute for everyone. High security hazard!',
    isWarning: true,
  },
];
