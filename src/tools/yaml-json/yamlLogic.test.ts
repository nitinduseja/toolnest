import { describe, it, expect } from 'vitest';
import { convertYamlToJson, convertJsonToYaml } from './yamlLogic';

describe('YAML ↔ JSON Converter Domain Logic', () => {
  const SAMPLE_YAML = `version: "3.8"
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    environment:
      NODE_ENV: production`;

  it('converts YAML to JSON accurately', () => {
    const res = convertYamlToJson(SAMPLE_YAML);
    expect(res.error).toBeUndefined();
    const parsed = JSON.parse(res.output);
    expect(parsed.version).toBe('3.8');
    expect(parsed.services.web.image).toBe('nginx:alpine');
    expect(parsed.services.web.ports).toEqual(['80:80']);
  });

  it('converts JSON to YAML accurately', () => {
    const json = JSON.stringify({
      appName: 'Toolnest',
      features: ['pwa', 'offline', 'fast'],
      meta: { release: 2026 },
    });
    const res = convertJsonToYaml(json);
    expect(res.error).toBeUndefined();
    expect(res.output).toContain('appName: Toolnest');
    expect(res.output).toContain('- pwa');
    expect(res.output).toContain('release: 2026');
  });

  it('handles invalid YAML with error message', () => {
    const brokenYaml = `key: [unclosed list`;
    const res = convertYamlToJson(brokenYaml);
    expect(res.error).toBeDefined();
    expect(res.output).toBe('');
  });

  it('handles invalid JSON with error message', () => {
    const brokenJson = `{ "key": incomplete `;
    const res = convertJsonToYaml(brokenJson);
    expect(res.error).toBeDefined();
    expect(res.output).toBe('');
  });

  it('handles empty inputs gracefully', () => {
    expect(convertYamlToJson('').output).toBe('');
    expect(convertJsonToYaml('').output).toBe('');
  });
});
