export type HeaderCategory =
  'security' | 'cors' | 'caching' | 'authentication' | 'content-negotiation';

export interface HttpHeaderInfo {
  name: string;
  category: HeaderCategory;
  direction: 'request' | 'response' | 'both';
  summary: string;
  example: string;
  description: string;
  rfc: string;
}

export const HTTP_HEADERS: HttpHeaderInfo[] = [
  // Security Headers
  {
    name: 'Content-Security-Policy',
    category: 'security',
    direction: 'response',
    summary: 'Restricts sources from which content can be loaded',
    example: "default-src 'self'; script-src 'self' https://trusted.cdn.com",
    description: 'Guards against Cross-Site Scripting (XSS), clickjacking, and injection attacks.',
    rfc: 'W3C CSP Level 3',
  },
  {
    name: 'Strict-Transport-Security',
    category: 'security',
    direction: 'response',
    summary: 'Forces browsers to connect via HTTPS only',
    example: 'max-age=63072000; includeSubDomains; preload',
    description: 'Prevents man-in-the-middle attacks and cookie hijacking by enforcing HTTPS.',
    rfc: 'RFC 6797',
  },
  {
    name: 'X-Frame-Options',
    category: 'security',
    direction: 'response',
    summary: 'Controls whether page can be rendered in an iframe',
    example: 'DENY',
    description: 'Prevents clickjacking by forbidding embedding in iframes or frames.',
    rfc: 'RFC 7034',
  },
  {
    name: 'X-Content-Type-Options',
    category: 'security',
    direction: 'response',
    summary: 'Prevents MIME-type sniffing',
    example: 'nosniff',
    description: 'Forces browser to adhere strictly to the MIME type sent in Content-Type.',
    rfc: 'Fetch Spec, 3.4',
  },

  // CORS Headers
  {
    name: 'Access-Control-Allow-Origin',
    category: 'cors',
    direction: 'response',
    summary: 'Indicates which origins can access the resource',
    example: 'https://example.com',
    description:
      'Allows browser to share responses across origins in Cross-Origin Resource Sharing.',
    rfc: 'Fetch Spec, 3.2.1',
  },
  {
    name: 'Access-Control-Allow-Methods',
    category: 'cors',
    direction: 'response',
    summary: 'Allowed HTTP methods for CORS preflight',
    example: 'GET, POST, PUT, DELETE, OPTIONS',
    description: 'Specifies which methods are permitted when accessing resource across origins.',
    rfc: 'Fetch Spec, 3.2.2',
  },
  {
    name: 'Access-Control-Allow-Headers',
    category: 'cors',
    direction: 'response',
    summary: 'Allowed custom HTTP headers for CORS preflight',
    example: 'Content-Type, Authorization, X-Requested-With',
    description: 'Used in preflight response to indicate headers client is allowed to send.',
    rfc: 'Fetch Spec, 3.2.3',
  },

  // Caching Headers
  {
    name: 'Cache-Control',
    category: 'caching',
    direction: 'both',
    summary: 'Directives for caching mechanisms in requests and responses',
    example: 'public, max-age=31536000, immutable',
    description:
      'Primary caching directive controlling browser and CDN cache expiration and validation.',
    rfc: 'RFC 9111, Section 5.2',
  },
  {
    name: 'ETag',
    category: 'caching',
    direction: 'response',
    summary: 'Entity tag identifier for resource version validation',
    example: 'W/"33a64df551425fcc55e4d42a148795d9f25f89d4"',
    description: 'Opaque validator allowing conditional GET requests with If-None-Match.',
    rfc: 'RFC 9110, Section 8.8.3',
  },
  {
    name: 'Last-Modified',
    category: 'caching',
    direction: 'response',
    summary: 'Date and time when resource was last altered',
    example: 'Wed, 21 Oct 2026 07:28:00 GMT',
    description: 'Validator used with If-Modified-Since to determine whether cache is stale.',
    rfc: 'RFC 9110, Section 8.8.2',
  },

  // Authentication Headers
  {
    name: 'Authorization',
    category: 'authentication',
    direction: 'request',
    summary: 'Credentials for authenticating client with server',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Contains authentication credentials, commonly Bearer tokens or Basic auth.',
    rfc: 'RFC 9110, Section 11.6.2',
  },
  {
    name: 'WWW-Authenticate',
    category: 'authentication',
    direction: 'response',
    summary: 'Defines authentication scheme that should be used',
    example: 'Bearer realm="example", error="invalid_token"',
    description: 'Sent with 401 Unauthorized to inform client how to authorize.',
    rfc: 'RFC 9110, Section 11.6.1',
  },

  // Content Negotiation
  {
    name: 'Content-Type',
    category: 'content-negotiation',
    direction: 'both',
    summary: 'MIME type of resource representation payload',
    example: 'application/json; charset=utf-8',
    description: 'Indicates the media type of the entity body sent in request or response.',
    rfc: 'RFC 9110, Section 8.3',
  },
  {
    name: 'Accept',
    category: 'content-negotiation',
    direction: 'request',
    summary: 'Acceptable MIME types for response',
    example: 'application/json, text/plain, */*',
    description: 'Informs server which media types client is capable of processing.',
    rfc: 'RFC 9110, Section 12.5.1',
  },
];
