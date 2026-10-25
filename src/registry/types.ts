import { ComponentType, LazyExoticComponent } from 'react';

export type CategoryId =
  | 'developer-tools'
  | 'encoders-decoders'
  | 'security-cryptography'
  | 'design-colors'
  | 'text-writing'
  | 'date-time'
  | 'math-converters'
  | 'data-files'
  | 'image-media'
  | 'web-network'
  | 'learning-generators'
  | 'everyday-productivity';

export interface CategoryDefinition {
  id: CategoryId;
  slug: string;
  name: string;
  description: string;
  iconName: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CategoryId;
  iconName: string;
  keywords: string[];
  component: LazyExoticComponent<ComponentType>;
  tags?: string[];
  isOfflineReady?: boolean;
  privacyNote?: string;
  badge?: string;
}
