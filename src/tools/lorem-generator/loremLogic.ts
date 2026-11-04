/**
 * Pure domain logic for generating configurable Lorem Ipsum dummy text.
 */

export type LoremUnit = 'paragraphs' | 'sentences' | 'words' | 'list';

export interface LoremOptions {
  unit?: LoremUnit;
  count?: number;
  startWithLorem?: boolean;
  wrapInHtml?: boolean;
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'architecto', 'beatae',
  'vitae', 'dicta', 'explicabo', 'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas',
  'aspernatur', 'aut', 'odit', 'fugit', 'consequuntur', 'magni', 'dolores', 'eos',
  'ratione', 'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem',
];

const STANDARD_OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

function getRandomWord(): string {
  const idx = Math.floor(Math.random() * LOREM_WORDS.length);
  return LOREM_WORDS[idx];
}

function generateSentence(minWords = 8, maxWords = 16): string {
  const length = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words: string[] = [];
  for (let i = 0; i < length; i++) {
    words.push(getRandomWord());
  }
  const sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(minSentences = 3, maxSentences = 6): string {
  const length = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  const sentences: string[] = [];
  for (let i = 0; i < length; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(' ');
}

export function generateLorem(options: LoremOptions = {}): string {
  const {
    unit = 'paragraphs',
    count = 3,
    startWithLorem = true,
    wrapInHtml = false,
  } = options;

  const boundedCount = Math.max(1, Math.min(count, 100));

  let results: string[] = [];

  switch (unit) {
    case 'words': {
      const words: string[] = [];
      if (startWithLorem) {
        const standardWords = STANDARD_OPENING.toLowerCase().replace(/[,.]/g, '').split(' ');
        words.push(...standardWords.slice(0, boundedCount));
      }
      while (words.length < boundedCount) {
        words.push(getRandomWord());
      }
      const text = words.slice(0, boundedCount).join(' ');
      return wrapInHtml ? `<p>${text}</p>` : text;
    }

    case 'sentences': {
      for (let i = 0; i < boundedCount; i++) {
        if (i === 0 && startWithLorem) {
          results.push(`${STANDARD_OPENING}, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);
        } else {
          results.push(generateSentence());
        }
      }
      if (wrapInHtml) {
        return results.map((s) => `<p>${s}</p>`).join('\n');
      }
      return results.join(' ');
    }

    case 'list': {
      for (let i = 0; i < boundedCount; i++) {
        results.push(generateSentence(4, 9).replace(/\.$/, ''));
      }
      if (wrapInHtml) {
        return `<ul>\n${results.map((li) => `  <li>${li}</li>`).join('\n')}\n</ul>`;
      }
      return results.map((li) => `- ${li}`).join('\n');
    }

    case 'paragraphs':
    default: {
      for (let i = 0; i < boundedCount; i++) {
        if (i === 0 && startWithLorem) {
          const para = `${STANDARD_OPENING}, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
          results.push(para);
        } else {
          results.push(generateParagraph());
        }
      }
      if (wrapInHtml) {
        return results.map((p) => `<p>${p}</p>`).join('\n\n');
      }
      return results.join('\n\n');
    }
  }
}

