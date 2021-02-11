import uid from './uid';
import regexpQuery from './regexp'; // eslint-disable-line import/no-cycle
import clip from './clip'; // eslint-disable-line import/no-cycle

/* eslint-disable import/no-unused-modules */
declare namespace HighlightWords {
  export interface Chunk {
    key: string;
    text: string;
    match: boolean;
  }

  export interface Options {
    text: string;
    query: string;
    clipBy?: number;
    matchExactly?: boolean;
  }

  export interface Clip {
    curr: Chunk;
    next?: Chunk;
    prev?: Chunk;
    clipBy?: number;
  }

  export interface Query {
    terms: string;
    matchExactly?: boolean;
  }
}

export { HighlightWords };
/* eslint-enable import/no-unused-modules */

const hasLength = (str: string): boolean => str.length > 0;

/**
 * Split a text into chunks denoting which are a match and which are not based on a user search term.
 * @param text          String  The text to split.
 * @param query         String  The query to split by. This can contain multiple words.
 * @param clipBy        Number  Clip the non-matches by a certain number of words to provide context around the matches.
 * @param matchExactly  Boolean If we have multiple words in the query, we will match any of the words if exact is false. For example, searching for "brown fox" in "the brown cute fox" will yield both "brown" and "fox" as matches. While if exact is true, the same search will return no results.
 */
const highlightWords = ({
  text,
  query,
  clipBy,
  matchExactly = false
}: Readonly<HighlightWords.Options>): HighlightWords.Chunk[] => {
  // Let's make sure that the user cannot pass in just a bunch of spaces
  const safeQuery = query.trim();

  if (safeQuery === '') {
    return [
      {
        key: uid(),
        text,
        match: false
      }
    ];
  }

  const searchRegexp = new RegExp(
    regexpQuery({ terms: safeQuery, matchExactly }),
    'ig'
  );

  type ReadonlyChunk = Readonly<HighlightWords.Chunk>; // eslint-disable-line @typescript-eslint/no-type-alias

  return text
    .split(searchRegexp) // Split the entire thing into an array of matches and non-matches
    .filter(hasLength) // Filter any matches that have the text with length of 0
    .map((str) => ({
      // Compose the object for a match
      key: uid(),
      text: str,
      match: matchExactly
        ? str.toLowerCase() === safeQuery.toLowerCase()
        : searchRegexp.test(str)
    }))
    .map((chunk: ReadonlyChunk, index, chunks: readonly ReadonlyChunk[]) => ({
      // For each chunk, clip the text if needed
      ...chunk, // All the props first
      ...(typeof clipBy === 'number' && {
        // We only overwrite the text if there is a clip
        text: clip({
          curr: chunk, // We need the current chunk
          ...(index < chunks.length - 1 && { next: chunks[index + 1] }), // If this wasn't the last chunk, set the next chunk
          ...(index > 0 && { prev: chunks[index - 1] }), // If this wasn't the first chunk, set the previous chunk
          clipBy
        })
      })
    }));
};

export default highlightWords;
