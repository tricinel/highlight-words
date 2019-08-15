import highlightWords, { HighlightWords } from '..';

jest.mock('../uuidv4', () => () => '1');

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type KeylessChunk = Omit<HighlightWords.Chunk, 'key'>;

// Let's add the same key to all the chunks
const withKey = (chunks: KeylessChunk[]): HighlightWords.Chunk[] =>
  chunks.map(chunk => ({ ...chunk, key: '1' }));

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
    let text = 'The brown fox jumped over the lazy dog';

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
    let text = 'The brown fox jumped over the lazy dog';

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
    let text = 'The brown fox jumped over the lazy dog';
    let query = 'cat';

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
    let text = 'The brown fox jumped over the lazy dog';
    let query = 'over';

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
    let text = 'One brown fox jumped over the lazy dog';
    let query = 'one';

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
    let text = 'The brown fox jumped over the lazy dog';
    let query = 'dog';

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
    let text = 'The cute brown fox jumped over the cute lazy dog';
    let query = 'cute';

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
    let text = 'The brown fox jumped over the lazy dog';
    let query = 'over';

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
    let text = 'The brown fox jumped over the lazy dog';
    let query = 'brown dog';

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
    let text = 'The brown fox jumped over the lazy dog';
    let query = 'brown dog';

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
