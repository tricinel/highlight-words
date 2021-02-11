import highlightWords from '..';
import type { HighlightWords } from '..';

jest.mock('../uid', () => () => '1');

type KeylessChunk = Omit<HighlightWords.Chunk, 'key'>; // eslint-disable-line @typescript-eslint/no-type-alias
type ReadonlyKeylessChunk = Readonly<KeylessChunk>; // eslint-disable-line @typescript-eslint/no-type-alias

// const's add the same key to all the chunks
const withKey = (
  chunks: readonly ReadonlyKeylessChunk[]
): HighlightWords.Chunk[] =>
  chunks.map((chunk: ReadonlyKeylessChunk) => ({ ...chunk, key: '1' }));

describe('Split a string into an array of chunks', () => {
  test('No matches found if the search term and the query are empty', () => {
    expect(highlightWords({ text: '', query: '' })).toEqual(
      withKey([
        {
          text: '',
          match: false
        }
      ])
    );
  });

  test('No matches found if the search term is empty', () => {
    const text = 'The brown fox jumped over the lazy dog';

    expect(highlightWords({ text, query: '' })).toEqual(
      withKey([
        {
          text,
          match: false
        }
      ])
    );
  });

  test('No matches found if the search term is just a bunch of empty spaces', () => {
    const text = 'The brown fox jumped over the lazy dog';

    expect(highlightWords({ text, query: '    ' })).toEqual(
      withKey([
        {
          text,
          match: false
        }
      ])
    );
  });

  test('No matches found in the text', () => {
    const text = 'The brown fox jumped over the lazy dog';
    const query = 'cat';

    expect(highlightWords({ text, query })).toEqual(
      withKey([
        {
          text,
          match: false
        }
      ])
    );
  });

  test('One match found in the middle of the text', () => {
    const text = 'The brown fox jumped over the lazy dog';
    const query = 'over';

    expect(highlightWords({ text, query })).toEqual(
      withKey([
        {
          text: 'The brown fox jumped ',
          match: false
        },
        {
          text: 'over',
          match: true
        },
        {
          text: ' the lazy dog',
          match: false
        }
      ])
    );
  });

  test('One match found at the beginning of the text', () => {
    const text = 'One brown fox jumped over the lazy dog';
    const query = 'one';

    expect(highlightWords({ text, query })).toEqual(
      withKey([
        {
          text: 'One',
          match: true
        },
        {
          text: ' brown fox jumped over the lazy dog',
          match: false
        }
      ])
    );
  });

  test('One match found at the end of the text', () => {
    const text = 'The brown fox jumped over the lazy dog';
    const query = 'dog';

    expect(highlightWords({ text, query })).toEqual(
      withKey([
        {
          text: 'The brown fox jumped over the lazy ',
          match: false
        },
        {
          text: 'dog',
          match: true
        }
      ])
    );
  });

  test('Two matches found in the text', () => {
    const text = 'The cute brown fox jumped over the cute lazy dog';
    const query = 'cute';

    expect(highlightWords({ text, query })).toEqual(
      withKey([
        {
          text: 'The ',
          match: false
        },
        {
          text: 'cute',
          match: true
        },
        {
          text: ' brown fox jumped over the ',
          match: false
        },
        {
          text: 'cute',
          match: true
        },
        {
          text: ' lazy dog',
          match: false
        }
      ])
    );
  });
});

describe('Clipping', () => {
  test('Use clipped text around the non-matches instead of the full text', () => {
    const text = 'The brown fox jumped over the lazy dog';
    const query = 'over';

    expect(highlightWords({ text, query, clipBy: 3 })).toEqual(
      withKey([
        {
          text: '... fox jumped ',
          match: false
        },
        {
          text: 'over',
          match: true
        },
        {
          text: ' the lazy ...',
          match: false
        }
      ])
    );
  });
});

describe('Exact matching', () => {
  test('Split a string and match all individual words', () => {
    const text = 'The brown fox jumped over the lazy dog';
    const query = 'brown dog';

    expect(highlightWords({ text, query, matchExactly: false })).toEqual(
      withKey([
        {
          text: 'The ',
          match: false
        },
        {
          text: 'brown',
          match: true
        },
        {
          text: ' fox jumped over the lazy ',
          match: false
        },
        {
          text: 'dog',
          match: true
        }
      ])
    );
  });

  test('Split a string and match exactly the search term', () => {
    const text = 'The brown fox jumped over the lazy dog';
    const query = 'brown dog';

    expect(highlightWords({ text, query, matchExactly: true })).toEqual(
      withKey([
        {
          text: 'The brown fox jumped over the lazy dog',
          match: false
        }
      ])
    );
  });
});
