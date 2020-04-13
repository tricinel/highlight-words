import { HighlightWords } from '.'; // eslint-disable-line import/no-cycle

// We need escape certain characters before creating the RegExp
// https://github.com/sindresorhus/escape-string-regexp
const escapeRegexp = (term: string): string =>
  term.replace(/[|\\{}()[\]^$+*?.-]/g, (char: string) => `\\${char}`);

const regexpQuery = ({
  terms,
  matchExactly = false
}: HighlightWords.Query): string => {
  if (typeof terms !== 'string') {
    throw new TypeError('Expected a string');
  }

  const escapedTerms = escapeRegexp(terms.trim());
  return `(${matchExactly ? escapedTerms : escapedTerms.split(' ').join('|')})`;
};

export default regexpQuery;
