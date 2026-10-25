import { CategoryDefinition } from './types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'developer-tools',
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'Core code inspection, formatting, diffing, and system testing utilities.',
    iconName: 'Terminal',
  },
  {
    id: 'encoders-decoders',
    slug: 'encoders-decoders',
    name: 'Encoders & Decoders',
    description: 'Transform data between formats including Base64, URL percent-encoding, and more.',
    iconName: 'Binary',
  },
  {
    id: 'security-cryptography',
    slug: 'security-cryptography',
    name: 'Security & Cryptography',
    description: 'Cryptographic hashing, secure random tokens, and client-side security helpers.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'design-colors',
    slug: 'design-colors',
    name: 'Design & Colors',
    description: 'Color space conversion, contrast checks, and palette exploration.',
    iconName: 'Palette',
  },
  {
    id: 'text-writing',
    slug: 'text-writing',
    name: 'Text & Writing',
    description: 'Text manipulation, diff checkers, regex pattern testers, and string analysis.',
    iconName: 'FileText',
  },
  {
    id: 'date-time',
    slug: 'date-time',
    name: 'Date & Time',
    description: 'Unix timestamps, epoch conversions, ISO 8601 formatting, and time calculations.',
    iconName: 'Clock',
  },
  {
    id: 'math-converters',
    slug: 'math-converters',
    name: 'Math & Converters',
    description: 'Accurate unit conversions for length, mass, temperature, and data sizes.',
    iconName: 'Calculator',
  },
  {
    id: 'data-files',
    slug: 'data-files',
    name: 'Data & Files',
    description: 'CSV, JSON, and structured data transformation tools with export options.',
    iconName: 'Database',
  },
  {
    id: 'image-media',
    slug: 'image-media',
    name: 'Image & Media',
    description: 'QR code generator, media conversion, and visual asset tools.',
    iconName: 'Image',
  },
  {
    id: 'web-network',
    slug: 'web-network',
    name: 'Web & Network Helpers',
    description: 'HTTP header inspect, URL parsers, and web connectivity utilities.',
    iconName: 'Globe',
  },
  {
    id: 'learning-generators',
    slug: 'learning-generators',
    name: 'Learning & Generators',
    description: 'UUID generators, mock data generators, and educational tools.',
    iconName: 'Sparkles',
  },
  {
    id: 'everyday-productivity',
    slug: 'everyday-productivity',
    name: 'Everyday Productivity',
    description: 'Quick daily productivity helpers, notes, and calculation utilities.',
    iconName: 'Briefcase',
  },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((cat) => [cat.id, cat]));
