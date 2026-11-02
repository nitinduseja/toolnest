/**
 * Response assertions engine for automated test checks.
 */
import { AssertionRule, ApiResponse, AssertionResult } from './types';

function evaluateSingleRule(rule: AssertionRule, res: ApiResponse): AssertionResult {
  switch (rule.type) {
    case 'status-200':
      return {
        id: rule.id,
        label: 'Status code is 200 OK',
        passed: res.status === 200,
        actual: `${res.status}`,
      };
    case 'status-2xx':
      return {
        id: rule.id,
        label: 'Status code is successful (2xx)',
        passed: res.status >= 200 && res.status < 300,
        actual: `${res.status}`,
      };
    case 'time-under': {
      const maxMs = parseInt(rule.targetValue || '500', 10);
      return {
        id: rule.id,
        label: `Response time < ${maxMs}ms`,
        passed: res.timeMs < maxMs,
        actual: `${res.timeMs}ms`,
      };
    }
    case 'is-json':
      return {
        id: rule.id,
        label: 'Response body is valid JSON',
        passed: res.isJson,
        actual: res.isJson ? 'Valid JSON' : 'Non-JSON or empty',
      };
    case 'body-contains': {
      const query = rule.targetValue || '';
      const passed = res.body.includes(query);
      return {
        id: rule.id,
        label: `Body contains "${query}"`,
        passed,
        actual: passed ? 'Found' : 'Missing',
      };
    }
  }
}

export function evaluateAssertions(rules: AssertionRule[], res: ApiResponse): AssertionResult[] {
  return rules.filter((r) => r.enabled).map((rule) => evaluateSingleRule(rule, res));
}
