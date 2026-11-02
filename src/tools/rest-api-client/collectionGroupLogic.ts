/**
 * Pure business logic for grouping, exporting, and managing collections.
 */
import { ApiRequest, CollectionGroup } from './types';
import { buildEffectiveUrl } from './curlLogic';

export function groupRequestsByCollection(requests: ApiRequest[]): CollectionGroup[] {
  const map = new Map<string, ApiRequest[]>();

  requests.forEach((req) => {
    const colName = req.collectionName?.trim() || 'Default Collection';
    const list = map.get(colName) || [];
    list.push(req);
    map.set(colName, list);
  });

  return Array.from(map.entries()).map(([name, reqs]) => ({
    name,
    requests: reqs,
  }));
}

function mapRequestToPostmanItem(req: ApiRequest) {
  const effectiveUrl = buildEffectiveUrl(req.url, req.params);
  return {
    name: req.name || req.url,
    request: {
      method: req.method,
      header: req.headers
        .filter((h) => h.enabled && h.key.trim())
        .map((h) => ({ key: h.key, value: h.value })),
      url: { raw: effectiveUrl },
      body:
        req.bodyType !== 'none'
          ? {
              mode: 'raw',
              raw: req.bodyContent || '',
            }
          : undefined,
    },
  };
}

export function exportCollectionAsPostman(collectionName: string, requests: ApiRequest[]): string {
  const payload = {
    info: {
      name: collectionName,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: requests.map(mapRequestToPostmanItem),
  };
  return JSON.stringify(payload, null, 2);
}

export function exportAllCollectionsAsPostman(requests: ApiRequest[]): string {
  const groups = groupRequestsByCollection(requests);
  const payload = {
    info: {
      name: 'Toolnest Collections',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: groups.map((g) => ({
      name: g.name,
      item: g.requests.map(mapRequestToPostmanItem),
    })),
  };
  return JSON.stringify(payload, null, 2);
}

export function duplicateCollectionRequest(req: ApiRequest): ApiRequest {
  return {
    ...req,
    id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: req.name ? `${req.name} (Copy)` : 'Copy of Request',
  };
}
