import { describe, it, expect, vi } from 'vitest';
import {
  groupRequestsByCollection,
  exportCollectionAsPostman,
  exportAllCollectionsAsPostman,
  duplicateCollectionRequest,
} from './collectionGroupLogic';
import { runCollectionSequence, runCollectionItem } from './collectionRunnerLogic';
import { parsePostmanCollection, parseOpenApiSpec } from './collectionImportLogic';
import { ApiRequest } from './types';
import * as executor from './requestExecutorLogic';

describe('collectionGroupLogic', () => {
  const sampleRequests: ApiRequest[] = [
    {
      id: 'req_1',
      name: 'Get Users',
      collectionName: 'User Service',
      method: 'GET',
      url: 'https://api.example.com/users',
      params: [{ id: 'p1', key: 'page', value: '1', enabled: true }],
      headers: [{ id: 'h1', key: 'Accept', value: 'application/json', enabled: true }],
      auth: { type: 'none' },
      bodyType: 'none',
      bodyContent: '',
      formParams: [],
    },
    {
      id: 'req_2',
      name: 'Create User',
      collectionName: 'User Service',
      method: 'POST',
      url: 'https://api.example.com/users',
      params: [],
      headers: [],
      auth: { type: 'none' },
      bodyType: 'json',
      bodyContent: '{"name":"Alice"}',
      formParams: [],
    },
    {
      id: 'req_3',
      name: 'Health Check',
      method: 'GET',
      url: 'https://api.example.com/health',
      params: [],
      headers: [],
      auth: { type: 'none' },
      bodyType: 'none',
      bodyContent: '',
      formParams: [],
    },
  ];

  it('groups requests by collectionName with default fallback', () => {
    const groups = groupRequestsByCollection(sampleRequests);
    expect(groups).toHaveLength(2);

    const userGroup = groups.find((g) => g.name === 'User Service');
    expect(userGroup?.requests).toHaveLength(2);

    const defaultGroup = groups.find((g) => g.name === 'Default Collection');
    expect(defaultGroup?.requests).toHaveLength(1);
  });

  it('exports collection as valid Postman v2.1.0 JSON schema', () => {
    const jsonStr = exportCollectionAsPostman('User Service', sampleRequests.slice(0, 2));
    const parsed = JSON.parse(jsonStr);

    expect(parsed.info.name).toBe('User Service');
    expect(parsed.info.schema).toContain('v2.1.0/collection.json');
    expect(parsed.item).toHaveLength(2);
    expect(parsed.item[0].name).toBe('Get Users');
    expect(parsed.item[0].request.url.raw).toBe('https://api.example.com/users?page=1');
  });

  it('exports all collections as grouped Postman collection', () => {
    const jsonStr = exportAllCollectionsAsPostman(sampleRequests);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.info.name).toBe('Toolnest Collections');
    expect(parsed.item).toHaveLength(2);
    expect(parsed.item[0].name).toBe('User Service');
  });

  it('duplicates collection request with a new id and (Copy) label', () => {
    const original = sampleRequests[0];
    const copy = duplicateCollectionRequest(original);

    expect(copy.id).not.toBe(original.id);
    expect(copy.name).toBe('Get Users (Copy)');
    expect(copy.url).toBe(original.url);
  });
});

describe('collectionImportLogic collectionName extraction', () => {
  it('extracts info.name from Postman collections into collectionName', () => {
    const json = JSON.stringify({
      info: { name: 'Billing API' },
      item: [
        {
          name: 'Charge Card',
          request: {
            method: 'POST',
            url: 'https://api.example.com/charges',
          },
        },
      ],
    });

    const reqs = parsePostmanCollection(json);
    expect(reqs).toHaveLength(1);
    expect(reqs[0].collectionName).toBe('Billing API');
  });

  it('extracts info.title from OpenAPI spec into collectionName', () => {
    const json = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Order Service' },
      paths: {
        '/orders': {
          get: {},
        },
      },
    });

    const reqs = parseOpenApiSpec(json);
    expect(reqs).toHaveLength(1);
    expect(reqs[0].collectionName).toBe('Order Service');
  });
});

describe('collectionRunnerLogic', () => {
  it('runs collection sequence and generates report', async () => {
    const spy = vi.spyOn(executor, 'executeApiRequest').mockResolvedValue({
      status: 200,
      statusText: 'OK',
      timeMs: 25,
      sizeBytes: 100,
      headers: {},
      body: '{"ok":true}',
      isJson: true,
    });

    const reqs: ApiRequest[] = [
      {
        id: 'r1',
        name: 'Step 1',
        method: 'GET',
        url: 'https://api.example.com/step1',
        params: [],
        headers: [],
        auth: { type: 'none' },
        bodyType: 'none',
        bodyContent: '',
        formParams: [],
      },
    ];

    const report = await runCollectionSequence({
      collectionName: 'Smoke Test',
      requests: reqs,
      env: null,
    });
    expect(report.collectionName).toBe('Smoke Test');
    expect(report.totalRequests).toBe(1);
    expect(report.passedRequests).toBe(1);
    expect(report.failedRequests).toBe(0);
    expect(report.results[0].status).toBe(200);

    const singleResult = await runCollectionItem(reqs[0], null);
    expect(singleResult.passed).toBe(true);
    expect(singleResult.status).toBe(200);

    spy.mockRestore();
  });
});
