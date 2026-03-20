import { describe, expect, test } from 'vitest';

import highlightWords from '../../dist/highlight-words.mjs';
import highlightWordsMin from '../../dist/highlight-words.min.mjs';

describe('dist (esm)', () => {
  test('exports a default function', () => {
    expect(typeof highlightWords).toBe('function');
  });

  test('splits text into match/non-match chunks', () => {
    const chunks = highlightWords({ text: 'the brown fox', query: 'brown' });

    expect(chunks.map((c) => ({ text: c.text, match: c.match }))).toEqual([
      { text: 'the ', match: false },
      { text: 'brown', match: true },
      { text: ' fox', match: false }
    ]);
  });

  test('minified build behaves the same as non-minified', () => {
    const input = { text: 'a b a', query: 'a' } as const;

    const a = highlightWords(input).map(({ text, match }) => ({ text, match }));
    const b = highlightWordsMin(input).map(({ text, match }) => ({
      text,
      match
    }));

    expect(b).toEqual(a);
  });
});
