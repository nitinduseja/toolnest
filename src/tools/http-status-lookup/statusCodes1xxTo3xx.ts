export type StatusCategory = '1xx' | '2xx' | '3xx' | '4xx' | '5xx';

export interface HttpStatusCode {
  code: number;
  name: string;
  category: StatusCategory;
  summary: string;
  description: string;
  rfc: string;
  cachable: boolean;
}

export const STATUS_CODES_1XX_3XX: HttpStatusCode[] = [
  // 1xx Informational
  {
    code: 100,
    name: 'Continue',
    category: '1xx',
    summary: 'Client should proceed with request payload',
    description: 'Initial part of request received, client can send remainder of request.',
    rfc: 'RFC 9110, 15.2.1',
    cachable: false,
  },
  {
    code: 101,
    name: 'Switching Protocols',
    category: '1xx',
    summary: 'Server agreed to upgrade connection protocol',
    description: 'Sent in response to an Upgrade request header (e.g. WebSocket handshake).',
    rfc: 'RFC 9110, 15.2.2',
    cachable: false,
  },
  {
    code: 103,
    name: 'Early Hints',
    category: '1xx',
    summary: 'Preload resources while server prepares final response',
    description: 'Allows client to start preloading critical subresources before headers arrive.',
    rfc: 'RFC 8297',
    cachable: false,
  },

  // 2xx Success
  {
    code: 200,
    name: 'OK',
    category: '2xx',
    summary: 'Request succeeded with returned payload',
    description: 'Standard response for successful HTTP requests with representation body.',
    rfc: 'RFC 9110, 15.3.1',
    cachable: true,
  },
  {
    code: 201,
    name: 'Created',
    category: '2xx',
    summary: 'Resource was successfully created',
    description: 'New resource created. Typically returned by POST or PUT with a Location header.',
    rfc: 'RFC 9110, 15.3.2',
    cachable: false,
  },
  {
    code: 202,
    name: 'Accepted',
    category: '2xx',
    summary: 'Request accepted for background processing',
    description: 'Request has been accepted for batch or async processing, not yet completed.',
    rfc: 'RFC 9110, 15.3.3',
    cachable: false,
  },
  {
    code: 204,
    name: 'No Content',
    category: '2xx',
    summary: 'Action succeeded without returning a body',
    description: 'Common for DELETE or PUT requests where no response payload is needed.',
    rfc: 'RFC 9110, 15.3.5',
    cachable: true,
  },
  {
    code: 206,
    name: 'Partial Content',
    category: '2xx',
    summary: 'Server fulfills partial Range request',
    description: 'Used for media streaming and resumed downloads with Range header.',
    rfc: 'RFC 9110, 15.3.7',
    cachable: true,
  },

  // 3xx Redirection
  {
    code: 301,
    name: 'Moved Permanently',
    category: '3xx',
    summary: 'Target URI moved permanently',
    description: 'Resource has been assigned a new permanent URI in the Location header.',
    rfc: 'RFC 9110, 15.4.2',
    cachable: true,
  },
  {
    code: 302,
    name: 'Found',
    category: '3xx',
    summary: 'Target URI resides temporarily at different URI',
    description: 'Temporary redirect. Historically caused methods to change to GET.',
    rfc: 'RFC 9110, 15.4.3',
    cachable: false,
  },
  {
    code: 304,
    name: 'Not Modified',
    category: '3xx',
    summary: 'Cached version is fresh and still valid',
    description: 'Sent for conditional GET when ETag or Last-Modified matches client cache.',
    rfc: 'RFC 9110, 15.4.5',
    cachable: true,
  },
  {
    code: 307,
    name: 'Temporary Redirect',
    category: '3xx',
    summary: 'Temporary redirect preserving request method',
    description: 'Method and body cannot change when redirecting (unlike 302).',
    rfc: 'RFC 9110, 15.4.8',
    cachable: false,
  },
  {
    code: 308,
    name: 'Permanent Redirect',
    category: '3xx',
    summary: 'Permanent redirect preserving request method',
    description: 'Method and body cannot change when redirecting (unlike 301).',
    rfc: 'RFC 9110, 15.4.9',
    cachable: true,
  },
];
