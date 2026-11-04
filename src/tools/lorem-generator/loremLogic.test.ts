import { describe, it, expect } from 'vitest';
import { generateLorem } from './loremLogic';

describe('Lorem Ipsum Generator Domain Logic', () => {
  it('generates specified number of paragraphs', () => {
    const text = generateLorem({ unit: 'paragraphs', count: 3 });
    const paras = text.split('\n\n');
    expect(paras.length).toBe(3);
    expect(paras[0].startsWith('Lorem ipsum')).toBe(true);
  });

  it('generates exact word count', () => {
    const text = generateLorem({ unit: 'words', count: 15, startWithLorem: false });
    const words = text.split(/\s+/);
    expect(words.length).toBe(15);
  });

  it('wraps paragraphs in HTML tags when requested', () => {
    const html = generateLorem({ unit: 'paragraphs', count: 2, wrapInHtml: true });
    expect(html.startsWith('<p>')).toBe(true);
    expect(html.endsWith('</p>')).toBe(true);
  });

  it('generates markdown or HTML lists', () => {
    const mdList = generateLorem({ unit: 'list', count: 4, wrapInHtml: false });
    expect(mdList.split('\n').length).toBe(4);
    expect(mdList.startsWith('- ')).toBe(true);

    const htmlList = generateLorem({ unit: 'list', count: 3, wrapInHtml: true });
    expect(htmlList.includes('<ul>')).toBe(true);
    expect(htmlList.includes('<li>')).toBe(true);
  });
});

