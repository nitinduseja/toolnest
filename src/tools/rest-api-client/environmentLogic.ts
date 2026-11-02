/**
 * Environment variable substitution and dynamic generator engine.
 */
import { Environment, ApiRequest, KeyValueItem } from './types';

function generateDynamicValue(key: string): string | null {
  if (key === '$uuid') {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `uuid_${Math.random().toString(36).slice(2)}`;
  }
  if (key === '$timestamp') {
    return `${Date.now()}`;
  }
  if (key === '$isoDate') {
    return new Date().toISOString();
  }
  if (key === '$randomInt') {
    return `${Math.floor(Math.random() * 1000) + 1}`;
  }
  return null;
}

export function substituteVariables(text: string, env: Environment | null): string {
  if (!text) return text;
  return text.replace(/\{\{([^}]+)\}\}/g, (match, rawKey) => {
    const key = rawKey.trim();
    const dynamic = generateDynamicValue(key);
    if (dynamic !== null) return dynamic;

    if (env) {
      const found = env.variables.find((v) => v.enabled && v.key.trim() === key);
      if (found) return found.value;
    }
    return match;
  });
}

function resolveKeyValueItems(items: KeyValueItem[], env: Environment | null): KeyValueItem[] {
  return items.map((item) => ({
    ...item,
    key: substituteVariables(item.key, env),
    value: substituteVariables(item.value, env),
  }));
}

export function resolveRequestEnvironment(req: ApiRequest, env: Environment | null): ApiRequest {
  if (!env) {
    // Still substitute dynamic variables like {{$uuid}} even if no environment is selected
    return {
      ...req,
      url: substituteVariables(req.url, null),
      params: resolveKeyValueItems(req.params, null),
      headers: resolveKeyValueItems(req.headers, null),
      bodyContent: substituteVariables(req.bodyContent, null),
      formParams: resolveKeyValueItems(req.formParams, null),
    };
  }

  return {
    ...req,
    url: substituteVariables(req.url, env),
    params: resolveKeyValueItems(req.params, env),
    headers: resolveKeyValueItems(req.headers, env),
    bodyContent: substituteVariables(req.bodyContent, env),
    formParams: resolveKeyValueItems(req.formParams, env),
    auth: {
      ...req.auth,
      bearerToken: req.auth.bearerToken
        ? substituteVariables(req.auth.bearerToken, env)
        : undefined,
      apiKeyValue: req.auth.apiKeyValue
        ? substituteVariables(req.auth.apiKeyValue, env)
        : undefined,
    },
  };
}
