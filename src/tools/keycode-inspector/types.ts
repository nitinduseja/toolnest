export interface KeyEventRecord {
  id: string;
  key: string;
  code: string;
  keyCode: number;
  which: number;
  location: number;
  locationName: string;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  repeat: boolean;
  timestamp: number;
}

export type KeySnippetFormat = 'vanilla-js' | 'react-ts' | 'shortcut-guard';
