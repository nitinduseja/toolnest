export interface UaParsedResult {
  raw: string;
  browser: {
    name: string;
    version: string;
    major: string;
  };
  os: {
    name: string;
    version: string;
  };
  device: {
    type: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot' | 'Unknown';
    vendor?: string;
    model?: string;
  };
  engine: {
    name: string;
    version: string;
  };
  cpu: {
    architecture: string;
  };
  isBot: boolean;
  botDetails?: string;
}

export interface UaPreset {
  id: string;
  name: string;
  category: string;
  ua: string;
}
