export type SyntaxTheme =
  'dracula' | 'one-dark' | 'nord' | 'monokai' | 'github-dark' | 'github-light';

export type WindowStyle = 'mac' | 'windows' | 'minimal' | 'none';

export type BackgroundPreset =
  'sunset' | 'neon' | 'ocean' | 'aurora' | 'midnight' | 'peach' | 'transparent';

export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'sql'
  | 'bash'
  | 'rust'
  | 'go'
  | 'text';

export type DropShadowLevel = 'none' | 'subtle' | 'medium' | 'intense' | 'neon';

export interface CodeCardConfig {
  code: string;
  language: SupportedLanguage;
  title: string;
  theme: SyntaxTheme;
  windowStyle: WindowStyle;
  background: BackgroundPreset;
  customBgColor?: string;
  padding: number;
  borderRadius: number;
  fontSize: number;
  showLineNumbers: boolean;
  shadow: DropShadowLevel;
}

export interface HighlightToken {
  type: 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'operator' | 'type' | 'text';
  text: string;
}

export interface ThemeColors {
  background: string;
  text: string;
  headerBg: string;
  titleColor: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
  function: string;
  operator: string;
  type: string;
  lineNumber: string;
}

export interface CodeCardPreset {
  id: string;
  name: string;
  config: Partial<CodeCardConfig>;
}
