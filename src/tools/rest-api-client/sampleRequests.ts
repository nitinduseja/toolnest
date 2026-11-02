/**
 * Pre-configured sample requests and webhook payload templates.
 */
import { ApiRequest } from './types';

export const SAMPLE_REQUESTS: { id: string; label: string; desc: string; req: ApiRequest }[] = [
  {
    id: 'jsonplaceholder-get',
    label: 'JSONPlaceholder (GET)',
    desc: 'Fetch public post data (CORS enabled)',
    req: {
      id: 'sample_get',
      name: 'Get Post #1',
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      params: [],
      headers: [{ id: 'h1', key: 'Accept', value: 'application/json', enabled: true }],
      auth: { type: 'none' },
      bodyType: 'none',
      bodyContent: '',
      formParams: [],
    },
  },
  {
    id: 'httpbin-post',
    label: 'HTTPBin (POST)',
    desc: 'Send JSON payload to echo server',
    req: {
      id: 'sample_post',
      name: 'Create User Profile',
      method: 'POST',
      url: 'https://httpbin.org/post',
      params: [{ id: 'p1', key: 'source', value: 'toolnest', enabled: true }],
      headers: [{ id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true }],
      auth: { type: 'none' },
      bodyType: 'json',
      bodyContent: JSON.stringify(
        {
          name: 'Jane Doe',
          role: 'Full-Stack Developer',
          skills: ['TypeScript', 'React', 'Node.js'],
        },
        null,
        2
      ),
      formParams: [],
    },
  },
  {
    id: 'github-webhook-sim',
    label: 'GitHub Webhook (POST)',
    desc: 'Simulate GitHub commit push event',
    req: {
      id: 'sample_github',
      name: 'GitHub Push Webhook',
      method: 'POST',
      url: 'https://httpbin.org/post',
      params: [],
      headers: [
        { id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true },
        { id: 'h2', key: 'X-GitHub-Event', value: 'push', enabled: true },
      ],
      auth: { type: 'none' },
      bodyType: 'json',
      bodyContent: JSON.stringify(
        {
          ref: 'refs/heads/main',
          before: '6113728f27ae82c7b1a12fcedd945f2f1502a15d',
          after: 'cafcef63454b70ae85c2846fbcb99aff846d03c4',
          repository: { name: 'toolnest', full_name: 'developer/toolnest' },
          pusher: { name: 'lead-dev' },
        },
        null,
        2
      ),
      formParams: [],
    },
  },
];
