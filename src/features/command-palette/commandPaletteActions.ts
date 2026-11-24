export interface PaletteAction {
  label: string;
  val: string;
  description?: string;
  fn: () => void | Promise<void>;
}

export interface BuildActionsParams {
  navigate: (path: string) => void;
  preference: string;
  setPreference: (pref: 'light' | 'dark' | 'system') => void;
  clearRecentTools: () => void;
}

export function buildQuickActions(params: BuildActionsParams): PaletteAction[] {
  const { navigate, preference, setPreference, clearRecentTools } = params;

  return [
    {
      label: 'Go to Home',
      val: 'action: home overview',
      description: 'Navigate to Toolnest homepage',
      fn: () => navigate('/'),
    },
    {
      label: 'Browse All Tools',
      val: 'action: all tools catalog directory',
      description: 'Explore full suite of developer tools',
      fn: () => navigate('/tools'),
    },
    {
      label: 'Open Favorites',
      val: 'action: starred favorites pinned tools',
      description: 'View your pinned favorite utilities',
      fn: () => navigate('/favorites'),
    },
    {
      label: 'View Recent Tools',
      val: 'action: recent tools history activity',
      description: 'Check previously opened tools',
      fn: () => navigate('/recent'),
    },
    {
      label: 'Settings & Preferences',
      val: 'action: settings config preferences theme',
      description: 'Customize layout, theme, and shortcuts',
      fn: () => navigate('/settings'),
    },
    {
      label: 'Toggle Light / Dark Theme',
      val: 'action: theme toggle switch dark light mode',
      description: 'Switch between light and dark display modes',
      fn: () => setPreference(preference === 'dark' ? 'light' : 'dark'),
    },
    {
      label: 'Copy New UUIDv4',
      val: 'action: generate uuid v4 random unique id clipboard',
      description: 'Generate a fresh UUID and copy to clipboard',
      fn: async () => {
        const uuid =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : '00000000-0000-4000-8000-000000000000';
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(uuid);
        }
      },
    },
    {
      label: 'Launch Full-Stack API Suite',
      val: 'action: workspace fullstack api rest client curl graphql split preset',
      description: 'Split workspace: REST Client & JSON Formatter',
      fn: () => navigate('/tools/rest-api-client?split=fullstack-api'),
    },
    {
      label: 'Launch Frontend Graphics Studio',
      val: 'action: workspace frontend graphics svg image compressor split preset',
      description: 'Split workspace: SVG Optimizer & Image Compressor',
      fn: () => navigate('/tools/svg-optimizer?split=frontend-graphics'),
    },
    {
      label: 'Launch Schema & Type Modeling',
      val: 'action: workspace schema typescript json schema type split preset',
      description: 'Split workspace: JSON to TS & JSON Schema',
      fn: () => navigate('/tools/json-to-typescript?split=schema-modeling'),
    },
    {
      label: 'Clear Recent Tools History',
      val: 'action: clear recent tools erase reset history',
      description: 'Remove all items from your recent tools list',
      fn: () => clearRecentTools(),
    },
  ];
}
