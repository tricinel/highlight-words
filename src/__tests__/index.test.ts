import { describe, expect, test, vi } from 'vitest';
import highlightWords from '..';
import type { HighlightWords } from '..';

vi.mock('../uid', () => {
  return {
    default: () => '1'
  };
});

type KeylessChunk = Omit<HighlightWords.Chunk, 'key'>;
type ReadonlyKeylessChunk = Readonly<KeylessChunk>;

// const's add the same key to all the chunks
const withKey = (
  chunks: readonly ReadonlyKeylessChunk[]
): HighlightWords.Chunk[] =>
  chunks.map((chunk: ReadonlyKeylessChunk) => ({ ...chunk, key: '1' }));

describe('Split a string using another string', () => {
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

describe('Split a string using a regular expression', () => {
  test('Find a match for a specific word', () => {
    const text = 'The brown fox jumped over the lazy dog';
    const query = '/(over)/';

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

  test('Highlight all the words', () => {
    const text = 'The brown fox';
    const query = /(\w+)/;

    // @ts-expect-error query should be string
    expect(highlightWords({ text, query })).toEqual(
      withKey([
        {
          text: 'The',
          match: true
        },
        {
          text: ' ',
          match: false
        },
        {
          text: 'brown',
          match: true
        },
        {
          text: ' ',
          match: false
        },
        {
          text: 'fox',
          match: true
        }
      ])
    );
  });

  test('Highlight multiple words', () => {
    const text = 'The quick brown fox jumped over the lazy dog';
    const query = /(quick|brown|fox)/;

    // @ts-expect-error query should be string
    expect(highlightWords({ text, query })).toEqual(
      withKey([
        {
          text: 'The ',
          match: false
        },
        {
          text: 'quick',
          match: true
        },
        {
          text: ' ',
          match: false
        },
        {
          text: 'brown',
          match: true
        },
        {
          text: ' ',
          match: false
        },
        {
          text: 'fox',
          match: true
        },
        {
          text: ' jumped over the lazy dog',
          match: false
        }
      ])
    );
  });

  test('Highlight multiple words where there are two or more consecutive spaces in the string', () => {
    const text = 'The quick brown fox jumped over the lazy dog';
    const query = 'quick  brown fox   jumped';

    expect(highlightWords({ text, query })).toEqual(
      withKey([
        {
          text: 'The ',
          match: false
        },
        {
          text: 'quick',
          match: true
        },
        {
          text: ' ',
          match: false
        },
        {
          text: 'brown',
          match: true
        },
        {
          text: ' ',
          match: false
        },
        {
          text: 'fox',
          match: true
        },
        {
          text: ' ',
          match: false
        },
        {
          text: 'jumped',
          match: true
        },
        {
          text: ' over the lazy dog',
          match: false
        }
      ])
    );
  });

  test('Highlight all instances of a complex string', () => {
    const text =
      'com.mycompany.com.authorization.config com.mycompany.com.core com.mycompany.com.controllers.invoices';
    const query = '/(com.mycompany.com[.0-9a-z]+)/';

    expect(highlightWords({ text, query })).toEqual(
      withKey([
        {
          text: 'com.mycompany.com.authorization.config',
          match: true
        },
        {
          text: ' ',
          match: false
        },
        {
          text: 'com.mycompany.com.core',
          match: true
        },
        {
          text: ' ',
          match: false
        },
        {
          text: 'com.mycompany.com.controllers.invoices',
          match: true
        }
      ])
    );
  });
});

describe('Sanity checks for empty strings and invalid cases', () => {
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
});

describe('Clipping', () => {
  test('Use clipped text around the non-matches instead of the full text when using a string', () => {
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

  test('Use clipped text around the non-matches instead of the full text when using a regular expression', () => {
    const text = 'The brown fox jumped over the lazy dog';
    const query = '/(over|fox)/';

    expect(highlightWords({ text, query, clipBy: 2 })).toEqual(
      withKey([
        {
          text: '... brown ',
          match: false
        },
        {
          text: 'fox',
          match: true
        },
        {
          text: ' jumped ',
          match: false
        },
        {
          text: 'over',
          match: true
        },
        {
          text: ' the ...',
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

  test('Split a string and match exactly the search term where there are two or more consecutive spaces in the string', () => {
    expect(
      highlightWords({
        text: 'The quick brown fox jumped over the lazy dog',
        query: 'quick  brown',
        matchExactly: true
      })
    ).toEqual(
      withKey([
        {
          text: 'The quick brown fox jumped over the lazy dog',
          match: false
        }
      ])
    );

    expect(
      highlightWords({
        text: 'The quick  brown fox jumped over the lazy dog',
        query: 'quick  brown fox',
        matchExactly: true
      })
    ).toEqual(
      withKey([
        {
          text: 'The ',
          match: false
        },
        {
          text: 'quick  brown fox',
          match: true
        },
        {
          text: ' jumped over the lazy dog',
          match: false
        }
      ])
    );
  });
});
