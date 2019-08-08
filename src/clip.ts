import { HighlightWords } from '.';

/**
 * This provides context around a chunk's text, based on the next and previous chunks.
 * e.g. If we have the string "The quick brown fox jumped over the lazy dog",
 * and the search term "fox jumped", with a padding of 2, we want to have the end result be:
 * "... quick brown fox jumped over the ..."
 * The search term, "fox jumped" is left as is, and the left and right chunks, instead of having
 * the text in full, will be clipped.
 */
export default function clip({
  curr,
  next,
  prev,
  clipBy = 3
}: HighlightWords.Clip): string {
  const words = curr.text.split(' ');
  const len = words.length;
  const ellipsis = len > clipBy ? '...' : '';

  // first we want to leave matches alone
  if (curr.match || clipBy >= len) {
    return curr.text;
  } else if (next && next.match) {
    // if we have a next chunk and it's a match
    return [ellipsis, ...words.slice(-clipBy)].join(' ');
  } else if (prev && prev.match) {
    // if we have a previous chunk and it's a match
    return [...words.slice(0, clipBy), ellipsis].join(' ');
  }

  // on the off chance that there is no next and no previous chunk
  // we should really never get here
  return curr.text;
}
