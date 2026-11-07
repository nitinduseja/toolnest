import { KeyEventRecord, KeySnippetFormat } from './types';

export function getLocationName(location: number): string {
  switch (location) {
    case 1:
      return 'Left side';
    case 2:
      return 'Right side';
    case 3:
      return 'Numpad';
    default:
      return 'Standard / General';
  }
}

export function getKeyDisplay(key: string): string {
  if (key === ' ') return 'Space';
  if (key === 'ArrowUp') return '↑ Up';
  if (key === 'ArrowDown') return '↓ Down';
  if (key === 'ArrowLeft') return '← Left';
  if (key === 'ArrowRight') return '→ Right';
  if (key === 'Enter') return '↵ Enter';
  if (key === 'Escape') return 'Esc';
  if (key === 'Backspace') return '⌫ Backspace';
  if (key === 'Tab') return '⇥ Tab';
  return key;
}

export function parseKeyboardEvent(
  e: Pick<
    KeyboardEvent,
    | 'key'
    | 'code'
    | 'keyCode'
    | 'which'
    | 'location'
    | 'ctrlKey'
    | 'altKey'
    | 'shiftKey'
    | 'metaKey'
    | 'repeat'
  >
): KeyEventRecord {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    key: e.key,
    code: e.code,
    keyCode: e.keyCode ?? (e as { which?: number }).which ?? 0,
    which: e.which ?? e.keyCode ?? 0,
    location: e.location ?? 0,
    locationName: getLocationName(e.location ?? 0),
    ctrlKey: Boolean(e.ctrlKey),
    altKey: Boolean(e.altKey),
    shiftKey: Boolean(e.shiftKey),
    metaKey: Boolean(e.metaKey),
    repeat: Boolean(e.repeat),
    timestamp: Date.now(),
  };
}

export function generateKeySnippet(event: KeyEventRecord, format: KeySnippetFormat): string {
  const parts: string[] = [];
  if (event.ctrlKey) parts.push('e.ctrlKey');
  if (event.metaKey) parts.push('e.metaKey');
  if (event.altKey) parts.push('e.altKey');
  if (event.shiftKey) parts.push('e.shiftKey');
  parts.push(`e.key === '${event.key}'`);

  const condition = parts.join(' && ');

  switch (format) {
    case 'vanilla-js':
      return `window.addEventListener('keydown', (event) => {\n  if (${condition}) {\n    event.preventDefault();\n    console.log('Action triggered for ${event.code}!');\n  }\n});`;
    case 'react-ts':
      return `const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {\n  if (${condition}) {\n    event.preventDefault();\n    // Handle ${event.key} event\n  }\n};`;
    case 'shortcut-guard':
      return `if (${condition}) {\n  // Code: ${event.code} (keyCode: ${event.keyCode})\n}`;
  }
}
