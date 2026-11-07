import { describe, it, expect } from 'vitest';
import { parseUserAgent, UA_PRESETS } from './uaParserLogic';

describe('uaParserLogic', () => {
  it('correctly parses Chrome on Windows 11', () => {
    const preset = UA_PRESETS.find((p) => p.id === 'chrome-win')!;
    const res = parseUserAgent(preset.ua);

    expect(res.browser.name).toBe('Chrome');
    expect(res.browser.major).toBe('122');
    expect(res.os.name).toBe('Windows');
    expect(res.os.version).toBe('10 / 11');
    expect(res.engine.name).toBe('Blink');
    expect(res.device.type).toBe('Desktop');
    expect(res.cpu.architecture).toContain('x86_64');
    expect(res.isBot).toBe(false);
  });

  it('correctly parses Safari on iPhone iOS', () => {
    const preset = UA_PRESETS.find((p) => p.id === 'iphone-safari')!;
    const res = parseUserAgent(preset.ua);

    expect(res.browser.name).toBe('Safari');
    expect(res.browser.version).toBe('17.3');
    expect(res.os.name).toBe('iOS');
    expect(res.os.version).toBe('17.3');
    expect(res.device.type).toBe('Mobile');
    expect(res.isBot).toBe(false);
  });

  it('correctly identifies Googlebot crawler', () => {
    const preset = UA_PRESETS.find((p) => p.id === 'googlebot')!;
    const res = parseUserAgent(preset.ua);

    expect(res.isBot).toBe(true);
    expect(res.device.type).toBe('Bot');
    expect(res.botDetails).toContain('Googlebot');
  });

  it('handles empty string gracefully', () => {
    const res = parseUserAgent('');

    expect(res.browser.name).toBe('Unknown Browser');
    expect(res.os.name).toBe('Unknown OS');
    expect(res.device.type).toBe('Unknown');
    expect(res.isBot).toBe(false);
  });
});
