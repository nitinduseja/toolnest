import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CHMOD_STATE,
  calculateRoleOctal,
  calculateSpecialOctal,
  roleFromOctal,
  specialFromOctal,
  calculateOctalString,
  calculateSymbolicString,
  calculateSymbolicNotation,
  parseOctalInput,
  parseSymbolicInput,
  generateChmodCommands,
  auditPermissions,
  COMMON_CHMOD_PRESETS,
} from './chmodLogic';
import { ChmodState, CommandOptions } from './types';

describe('chmodLogic', () => {
  describe('calculateRoleOctal & roleFromOctal', () => {
    it('converts role permissions to correct octal values', () => {
      expect(calculateRoleOctal({ read: false, write: false, execute: false })).toBe(0);
      expect(calculateRoleOctal({ read: false, write: false, execute: true })).toBe(1);
      expect(calculateRoleOctal({ read: false, write: true, execute: false })).toBe(2);
      expect(calculateRoleOctal({ read: false, write: true, execute: true })).toBe(3);
      expect(calculateRoleOctal({ read: true, write: false, execute: false })).toBe(4);
      expect(calculateRoleOctal({ read: true, write: false, execute: true })).toBe(5);
      expect(calculateRoleOctal({ read: true, write: true, execute: false })).toBe(6);
      expect(calculateRoleOctal({ read: true, write: true, execute: true })).toBe(7);
    });

    it('reconstructs role permissions from octal numbers', () => {
      expect(roleFromOctal(0)).toEqual({ read: false, write: false, execute: false });
      expect(roleFromOctal(5)).toEqual({ read: true, write: false, execute: true });
      expect(roleFromOctal(6)).toEqual({ read: true, write: true, execute: false });
      expect(roleFromOctal(7)).toEqual({ read: true, write: true, execute: true });
    });
  });

  describe('special permissions calculation', () => {
    it('calculates special bits correctly', () => {
      expect(calculateSpecialOctal({ setuid: false, setgid: false, sticky: false })).toBe(0);
      expect(calculateSpecialOctal({ setuid: true, setgid: false, sticky: false })).toBe(4);
      expect(calculateSpecialOctal({ setuid: false, setgid: true, sticky: false })).toBe(2);
      expect(calculateSpecialOctal({ setuid: false, setgid: false, sticky: true })).toBe(1);
      expect(calculateSpecialOctal({ setuid: true, setgid: true, sticky: true })).toBe(7);
    });

    it('reconstructs special permissions from octal digit', () => {
      expect(specialFromOctal(1)).toEqual({ setuid: false, setgid: false, sticky: true });
      expect(specialFromOctal(2)).toEqual({ setuid: false, setgid: true, sticky: false });
      expect(specialFromOctal(4)).toEqual({ setuid: true, setgid: false, sticky: false });
      expect(specialFromOctal(6)).toEqual({ setuid: true, setgid: true, sticky: false });
    });
  });

  describe('calculateOctalString & calculateSymbolicString', () => {
    it('generates standard 755 and 644 octal strings', () => {
      expect(calculateOctalString(DEFAULT_CHMOD_STATE)).toBe('755');
      expect(calculateSymbolicString(DEFAULT_CHMOD_STATE)).toBe('-rwxr-xr-x');

      const state644: ChmodState = {
        owner: { read: true, write: true, execute: false },
        group: { read: true, write: false, execute: false },
        others: { read: true, write: false, execute: false },
        special: { setuid: false, setgid: false, sticky: false },
        isDirectory: false,
      };
      expect(calculateOctalString(state644)).toBe('644');
      expect(calculateSymbolicString(state644)).toBe('-rw-r--r--');
    });

    it('handles directory prefix and sticky bit (1777 / /tmp)', () => {
      const state1777: ChmodState = {
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: true, execute: true },
        others: { read: true, write: true, execute: true },
        special: { setuid: false, setgid: false, sticky: true },
        isDirectory: true,
      };
      expect(calculateOctalString(state1777)).toBe('1777');
      expect(calculateSymbolicString(state1777)).toBe('drwxrwxrwt');
    });

    it('handles uppercase T when sticky bit is set without execute', () => {
      const stateStickyNoExec: ChmodState = {
        ...DEFAULT_CHMOD_STATE,
        others: { read: true, write: false, execute: false },
        special: { setuid: false, setgid: false, sticky: true },
        isDirectory: true,
      };
      expect(calculateSymbolicString(stateStickyNoExec)).toBe('drwxr-xr-T');
    });

    it('handles setuid and setgid with s and S representation', () => {
      const stateSetuid: ChmodState = {
        ...DEFAULT_CHMOD_STATE,
        special: { setuid: true, setgid: true, sticky: false },
      };
      expect(calculateSymbolicString(stateSetuid)).toBe('-rwsr-sr-x');

      const stateSetuidNoExec: ChmodState = {
        ...DEFAULT_CHMOD_STATE,
        owner: { read: true, write: true, execute: false },
        group: { read: true, write: false, execute: false },
        special: { setuid: true, setgid: true, sticky: false },
      };
      expect(calculateSymbolicString(stateSetuidNoExec)).toBe('-rwSr-Sr-x');
    });
  });

  describe('calculateSymbolicNotation', () => {
    it('formats symbolic notations for chmod commands', () => {
      expect(calculateSymbolicNotation(DEFAULT_CHMOD_STATE)).toBe('u=rwx,g=rx,o=rx');
      const stateSticky: ChmodState = {
        ...DEFAULT_CHMOD_STATE,
        special: { setuid: false, setgid: false, sticky: true },
      };
      expect(calculateSymbolicNotation(stateSticky)).toBe('u=rwx,g=rx,o=rx,+t');
    });
  });

  describe('parseOctalInput', () => {
    it('parses valid 3-digit octal strings', () => {
      const res = parseOctalInput('755');
      expect(res).not.toBeNull();
      expect(res?.owner?.read).toBe(true);
      expect(res?.owner?.write).toBe(true);
      expect(res?.owner?.execute).toBe(true);
      expect(res?.group?.write).toBe(false);
      expect(res?.others?.write).toBe(false);
    });

    it('parses valid 4-digit octal strings with special flags', () => {
      const res = parseOctalInput('1777');
      expect(res).not.toBeNull();
      expect(res?.special?.sticky).toBe(true);
      expect(res?.special?.setuid).toBe(false);
      expect(res?.owner?.read).toBe(true);
      expect(res?.others?.write).toBe(true);
    });

    it('returns null on invalid octal inputs', () => {
      expect(parseOctalInput('999')).toBeNull();
      expect(parseOctalInput('75')).toBeNull();
      expect(parseOctalInput('75555')).toBeNull();
      expect(parseOctalInput('abc')).toBeNull();
    });
  });

  describe('parseSymbolicInput', () => {
    it('parses 9-char and 10-char symbolic representations', () => {
      const res1 = parseSymbolicInput('-rwxr-xr-x');
      expect(res1).not.toBeNull();
      expect(res1?.isDirectory).toBe(false);
      expect(res1?.owner?.read).toBe(true);
      expect(res1?.group?.write).toBe(false);

      const res2 = parseSymbolicInput('drwxrwxrwt');
      expect(res2).not.toBeNull();
      expect(res2?.isDirectory).toBe(true);
      expect(res2?.special?.sticky).toBe(true);
    });

    it('returns null on invalid symbolic format', () => {
      expect(parseSymbolicInput('invalid-str')).toBeNull();
      expect(parseSymbolicInput('rwx')).toBeNull();
    });
  });

  describe('generateChmodCommands', () => {
    const defaultOpt: CommandOptions = {
      path: 'app.sh',
      recursive: false,
      verbose: false,
      changesOnly: false,
      silent: false,
      sudo: false,
    };

    it('generates basic chmod command', () => {
      const cmds = generateChmodCommands(DEFAULT_CHMOD_STATE, defaultOpt);
      expect(cmds.octalCommand).toBe('chmod 755 app.sh');
      expect(cmds.symbolicCommand).toBe('chmod u=rwx,g=rx,o=rx app.sh');
      expect(cmds.findCommand).toContain('find app.sh -type f -exec chmod 755 {} +');
    });

    it('handles modifiers, sudo, and paths with spaces', () => {
      const opt: CommandOptions = {
        path: 'my folder/script.sh',
        recursive: true,
        verbose: true,
        changesOnly: false,
        silent: false,
        sudo: true,
      };
      const cmds = generateChmodCommands(DEFAULT_CHMOD_STATE, opt);
      expect(cmds.octalCommand).toBe('sudo chmod -Rv 755 "my folder/script.sh"');
    });
  });

  describe('auditPermissions & presets', () => {
    it('warns on dangerous 777 permissions', () => {
      const state777: ChmodState = {
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: true, execute: true },
        others: { read: true, write: true, execute: true },
        special: { setuid: false, setgid: false, sticky: false },
        isDirectory: false,
      };
      const audit = auditPermissions(state777);
      expect(audit.warnings.length).toBeGreaterThan(0);
      expect(audit.warnings.some((w) => w.includes('777'))).toBe(true);
      expect(audit.recommendations.length).toBeGreaterThan(0);
    });

    it('validates common presets', () => {
      expect(COMMON_CHMOD_PRESETS.length).toBeGreaterThan(5);
      const preset644 = COMMON_CHMOD_PRESETS.find((p) => p.id === '644');
      expect(preset644).toBeDefined();
      expect(preset644?.octal).toBe('644');
    });
  });
});
