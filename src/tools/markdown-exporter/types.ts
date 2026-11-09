export type ExportTheme = 'modern' | 'academic' | 'minimal' | 'compact';
export type PageSize = 'a4' | 'letter';
export type PageOrientation = 'portrait' | 'landscape';

export interface DocumentMeta {
  title: string;
  author: string;
  date: string;
  includeCoverPage: boolean;
  includeHeaderFooter: boolean;
  pageSize: PageSize;
  orientation: PageOrientation;
  theme: ExportTheme;
}

export interface MarkdownPreset {
  id: string;
  name: string;
  description: string;
  markdown: string;
  meta: Partial<DocumentMeta>;
}
