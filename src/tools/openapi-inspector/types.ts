export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export interface OpenApiParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required?: boolean;
  type?: string;
  description?: string;
}

export interface OpenApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  tags: string[];
  parameters: OpenApiParameter[];
  requestBodySchema?: Record<string, unknown>;
  responseStatus: string;
  responseSchema?: Record<string, unknown>;
}

export interface OpenApiParsedDoc {
  valid: boolean;
  title: string;
  version: string;
  description: string;
  endpoints: OpenApiEndpoint[];
  tags: string[];
  error?: string;
}

export interface OpenApiPreset {
  id: string;
  name: string;
  description: string;
  spec: string;
}
