/**
 * Business logic for executing a collection of requests as an automated test runner.
 */
import { ApiRequest, Environment, CollectionRunItemResult, CollectionRunReport } from './types';
import { resolveRequestEnvironment } from './environmentLogic';
import { executeApiRequest } from './requestExecutorLogic';
import { evaluateAssertions } from './assertionLogic';

export async function runCollectionItem(
  req: ApiRequest,
  env: Environment | null
): Promise<CollectionRunItemResult> {
  const resolved = resolveRequestEnvironment(req, env);
  const res = await executeApiRequest(resolved);

  const assertionResults =
    req.assertions && req.assertions.length > 0
      ? evaluateAssertions(req.assertions, res)
      : undefined;

  const passed = assertionResults
    ? assertionResults.every((a) => a.passed)
    : res.status >= 200 && res.status < 400 && !res.isCorsError;

  return {
    requestId: req.id,
    requestName: req.name || req.url,
    method: req.method,
    url: resolved.url,
    status: res.status,
    statusText: res.statusText,
    timeMs: res.timeMs,
    passed,
    assertionResults,
    error: res.error,
  };
}

export interface RunSequenceOptions {
  collectionName: string;
  requests: ApiRequest[];
  env: Environment | null;
}

export async function runCollectionSequence(
  options: RunSequenceOptions,
  onItemComplete?: (item: CollectionRunItemResult, index: number) => void
): Promise<CollectionRunReport> {
  const { collectionName, requests, env } = options;
  const results: CollectionRunItemResult[] = [];
  let totalTime = 0;

  for (let i = 0; i < requests.length; i++) {
    const itemResult = await runCollectionItem(requests[i], env);
    results.push(itemResult);
    totalTime += itemResult.timeMs;
    if (onItemComplete) {
      onItemComplete(itemResult, i);
    }
  }

  const passedCount = results.filter((r) => r.passed).length;

  return {
    collectionName,
    totalRequests: requests.length,
    passedRequests: passedCount,
    failedRequests: requests.length - passedCount,
    totalTimeMs: totalTime,
    results,
  };
}
