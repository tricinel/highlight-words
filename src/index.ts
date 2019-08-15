import uuidv4 from './uuidv4';
import regexpQuery from './regexp';
import clip from './clip';

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
    next: Chunk;
    prev: Chunk;
    clipBy?: number;
  }

  export interface Query {
    terms: string;
    matchExactly?: boolean;
  }
}

export { HighlightWords };

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
}: HighlightWords.Options): HighlightWords.Chunk[] => {
  // Let's make sure that the user cannot pass in just a bunch of spaces
  query = query.trim();

  if (query === '') {
    return [
      {
        key: uuidv4(),
        text,
        match: false
      }
    ];
  }

  const searchRegexp = new RegExp(
    regexpQuery({ terms: query, matchExactly }),
    'ig'
  );

  return text
    .split(searchRegexp) // split the entire thing into an array of matches and non-matches
    .filter(hasLength) //filter any matches that have the text with length of 0
    .map(str => ({
      // compose the object for a match
      key: uuidv4(),
      text: str,
      match: matchExactly
        ? str.toLowerCase() === query.toLowerCase()
        : searchRegexp.test(str)
    }))
    .map((chunk, index, chunks) => ({
      // for each chunk, clip the text if needed
      ...chunk, // all the props first
      ...(clipBy && {
        // we only overwrite the text if there is a clip
        text: clip({
          curr: chunk, // we need the current chunk
          ...(index < chunks.length - 1 && { next: chunks[index + 1] }), // if this wasn't the last chunk, set the next chunk
          ...(index > 0 && { prev: chunks[index - 1] }), // if this wasn't the first chunk, set the previous chunk
          clipBy
        })
      })
    }));
};

export default highlightWords;
