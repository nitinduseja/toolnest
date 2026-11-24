export type WebhookProvider = 'github' | 'stripe' | 'shopify' | 'slack' | 'custom';

export interface WebhookTemplate {
  id: string;
  provider: WebhookProvider;
  event: string;
  name: string;
  payload: string;
}

export interface WebhookSignatureResult {
  signature: string;
  headerName: string;
  headerValue: string;
  timestamp?: number;
}
