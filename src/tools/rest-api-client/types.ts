/**
 * Types for the REST API & Webhook Playground tool.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface KeyValueItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export type AuthType = 'none' | 'bearer' | 'basic' | 'apikey';

export interface AuthConfig {
  type: AuthType;
  bearerToken?: string;
  basicUser?: string;
  basicPassword?: string;
  apiKeyName?: string;
  apiKeyValue?: string;
  apiKeyLocation?: 'header' | 'query';
}

export type BodyType = 'none' | 'json' | 'form' | 'raw';

export type AssertionType =
  'status-200' | 'status-2xx' | 'time-under' | 'body-contains' | 'is-json';

export interface AssertionRule {
  id: string;
  type: AssertionType;
  targetValue?: string;
  enabled: boolean;
}

export interface AssertionResult {
  id: string;
  label: string;
  passed: boolean;
  actual?: string;
}

export interface Environment {
  id: string;
  name: string;
  variables: KeyValueItem[];
}

export interface ApiRequest {
  id: string;
  name?: string;
  collectionName?: string;
  method: HttpMethod;
  url: string;
  params: KeyValueItem[];
  headers: KeyValueItem[];
  auth: AuthConfig;
  bodyType: BodyType;
  bodyContent: string;
  formParams: KeyValueItem[];
  assertions?: AssertionRule[];
}

export interface CollectionGroup {
  name: string;
  requests: ApiRequest[];
}

export interface CollectionRunItemResult {
  requestId: string;
  requestName: string;
  method: HttpMethod;
  url: string;
  status: number;
  statusText: string;
  timeMs: number;
  passed: boolean;
  assertionResults?: AssertionResult[];
  error?: string;
}

export interface CollectionRunReport {
  collectionName: string;
  totalRequests: number;
  passedRequests: number;
  failedRequests: number;
  totalTimeMs: number;
  results: CollectionRunItemResult[];
}

export interface ApiResponse {
  status: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number;
  headers: Record<string, string>;
  body: string;
  isJson: boolean;
  error?: string;
  isCorsError?: boolean;
  assertionResults?: AssertionResult[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  request: ApiRequest;
  responseSummary?: {
    status: number;
    timeMs: number;
    error?: string;
  };
}
