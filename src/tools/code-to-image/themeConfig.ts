import {
  CodeCardConfig,
  SyntaxTheme,
  ThemeColors,
  BackgroundPreset,
  CodeCardPreset,
} from './types';

export const CODE_PRESETS: CodeCardPreset[] = [
  {
    id: 'mac-dracula',
    name: 'Modern Mac (Dracula)',
    config: {
      theme: 'dracula',
      windowStyle: 'mac',
      background: 'sunset',
      padding: 32,
      borderRadius: 12,
      fontSize: 14,
      showLineNumbers: true,
    },
  },
  {
    id: 'clean-nord',
    name: 'Clean Minimalist (Nord)',
    config: {
      theme: 'nord',
      windowStyle: 'minimal',
      background: 'ocean',
      padding: 24,
      borderRadius: 16,
      fontSize: 14,
      showLineNumbers: false,
    },
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk (One Dark)',
    config: {
      theme: 'one-dark',
      windowStyle: 'mac',
      background: 'neon',
      padding: 40,
      borderRadius: 14,
      fontSize: 15,
      showLineNumbers: true,
    },
  },
  {
    id: 'github-docs',
    name: 'Light Docs (GitHub)',
    config: {
      theme: 'github-light',
      windowStyle: 'mac',
      background: 'peach',
      padding: 28,
      borderRadius: 10,
      fontSize: 13,
      showLineNumbers: true,
    },
  },
];

export const DEFAULT_SAMPLE_CODE = `// Modern TypeScript API Handler
import { NextRequest, NextResponse } from 'next/server';

interface UserPayload {
  id: string;
  role: 'admin' | 'developer';
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const payload: UserPayload = await req.json();
  const signature = crypto.randomUUID();
  
  return NextResponse.json({
    status: 200,
    signature,
    active: true,
  });
}`;

export function createDefaultConfig(): CodeCardConfig {
  return {
    code: DEFAULT_SAMPLE_CODE,
    language: 'typescript',
    title: 'handler.ts',
    theme: 'dracula',
    windowStyle: 'mac',
    background: 'sunset',
    padding: 32,
    borderRadius: 12,
    fontSize: 14,
    showLineNumbers: true,
    shadow: 'medium',
  };
}

export const THEME_MAP: Record<SyntaxTheme, ThemeColors> = {
  dracula: {
    background: '#282a36',
    text: '#f8f8f2',
    headerBg: '#21222c',
    titleColor: '#6272a4',
    keyword: '#ff79c6',
    string: '#f1fa8c',
    number: '#bd93f9',
    comment: '#6272a4',
    function: '#50fa7b',
    operator: '#ff79c6',
    type: '#8be9fd',
    lineNumber: '#6272a4',
  },
  'one-dark': {
    background: '#282c34',
    text: '#abb2bf',
    headerBg: '#21252b',
    titleColor: '#5c6370',
    keyword: '#c678dd',
    string: '#98c379',
    number: '#d19a66',
    comment: '#5c6370',
    function: '#61afef',
    operator: '#56b6c2',
    type: '#e5c07b',
    lineNumber: '#4b5263',
  },
  nord: {
    background: '#2e3440',
    text: '#d8dee9',
    headerBg: '#242933',
    titleColor: '#4c566a',
    keyword: '#81a1c1',
    string: '#a3be8c',
    number: '#b48ead',
    comment: '#616e88',
    function: '#88c0d0',
    operator: '#81a1c1',
    type: '#8fbcbb',
    lineNumber: '#4c566a',
  },
  monokai: {
    background: '#272822',
    text: '#f8f8f2',
    headerBg: '#1e1f1c',
    titleColor: '#75715e',
    keyword: '#f92672',
    string: '#e6db74',
    number: '#ae81ff',
    comment: '#75715e',
    function: '#a6e22e',
    operator: '#f92672',
    type: '#66d9ef',
    lineNumber: '#75715e',
  },
  'github-dark': {
    background: '#0d1117',
    text: '#c9d1d9',
    headerBg: '#010409',
    titleColor: '#8b949e',
    keyword: '#ff7b72',
    string: '#a5d6ff',
    number: '#79c0ff',
    comment: '#8b949e',
    function: '#d2a8ff',
    operator: '#ff7b72',
    type: '#ffa657',
    lineNumber: '#484f58',
  },
  'github-light': {
    background: '#ffffff',
    text: '#24292f',
    headerBg: '#f6f8fa',
    titleColor: '#57606a',
    keyword: '#cf222e',
    string: '#0a3069',
    number: '#0550ae',
    comment: '#6e7781',
    function: '#8250df',
    operator: '#cf222e',
    type: '#953800',
    lineNumber: '#8c959f',
  },
};

export function getThemeColors(theme: SyntaxTheme): ThemeColors {
  return THEME_MAP[theme] || THEME_MAP.dracula;
}

export function getBackgroundDefs(preset: BackgroundPreset): { fill: string; defs: string } {
  switch (preset) {
    case 'sunset':
      return {
        fill: 'url(#bg-gradient)',
        defs: '<linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f97316"/><stop offset="50%" stop-color="#ec4899"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient>',
      };
    case 'neon':
      return {
        fill: 'url(#bg-gradient)',
        defs: '<linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"/><stop offset="50%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#9333ea"/></linearGradient>',
      };
    case 'ocean':
      return {
        fill: 'url(#bg-gradient)',
        defs: '<linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>',
      };
    case 'aurora':
      return {
        fill: 'url(#bg-gradient)',
        defs: '<linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="50%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient>',
      };
    case 'midnight':
      return {
        fill: 'url(#bg-gradient)',
        defs: '<linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>',
      };
    case 'peach':
      return {
        fill: 'url(#bg-gradient)',
        defs: '<linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#f43f5e"/></linearGradient>',
      };
    default:
      return { fill: 'transparent', defs: '' };
  }
}
