import clip from '../clip';
import { HighlightWords } from '..';

describe('Provide the textual context around the matches', () => {
  test("It leaves the chunk alone if it's a match", () => {
    let currentChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'The quick brown fox jumped',
      match: true
    };

    expect(
      clip({
        curr: currentChunk,
        next: null,
        prev: null
      })
    ).toEqual('The quick brown fox jumped');
  });

  test('It leaves the chunk alone if its text word length is smaller or equal to the clipBy', () => {
    let currentChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'quick brown',
      match: false
    };

    expect(
      clip({
        curr: currentChunk,
        next: null,
        prev: null,
        clipBy: 2
      })
    ).toEqual('quick brown');
  });

  test('It leaves the chunk alone when the clipBy is greater than the word length', () => {
    let currentChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'quick brown',
      match: false
    };

    let nextChunk: HighlightWords.Chunk = {
      key: '1',
      text: ' over the lazy dog',
      match: true
    };

    expect(
      clip({
        curr: currentChunk,
        next: nextChunk,
        prev: null,
        clipBy: 10
      })
    ).toEqual('quick brown');
  });

  test("It leaves the chunk alone if it's a match and the next and previous are also matches", () => {
    let previousChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'The quick brown ',
      match: true
    };

    let currentChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'fox jumped',
      match: true
    };

    let nextChunk: HighlightWords.Chunk = {
      key: '1',
      text: ' over the lazy dog',
      match: true
    };

    expect(
      clip({
        curr: currentChunk,
        next: nextChunk,
        prev: previousChunk,
        clipBy: 1
      })
    ).toEqual('fox jumped');
  });

  test("It leaves the chunk alone if it's not a match and the next and previous are matches, but there are not enough words to clip by", () => {
    let previousChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'The quick brown ',
      match: true
    };

    let currentChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'fox jumped',
      match: false
    };

    let nextChunk: HighlightWords.Chunk = {
      key: '1',
      text: ' over the lazy dog',
      match: true
    };

    expect(
      clip({
        curr: currentChunk,
        next: nextChunk,
        prev: previousChunk,
        clipBy: 4
      })
    ).toEqual('fox jumped');
  });

  test("It clips the chunk if it's not a match and the next and previous are matches, and there are enough words to clip by", () => {
    let previousChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'The quick ',
      match: true
    };

    let currentChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'brown fox jumped over the lazy',
      match: false
    };

    let nextChunk: HighlightWords.Chunk = {
      key: '1',
      text: ' dog',
      match: true
    };

    expect(
      clip({
        curr: currentChunk,
        next: nextChunk,
        prev: previousChunk,
        clipBy: 2
      })
    ).toEqual('brown fox ... the lazy');
  });

  test('It clips the chunk if the previous was a match', () => {
    let previousChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'The quick brown',
      match: true
    };
    let currentChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'fox jumped over',
      match: false
    };

    expect(
      clip({
        curr: currentChunk,
        next: null,
        prev: previousChunk,
        clipBy: 2
      })
    ).toEqual('fox jumped ...');
  });

  test('It clips the chunk if the next was a match', () => {
    let nextChunk: HighlightWords.Chunk = {
      key: '1',
      text: ' the lazy dog',
      match: true
    };
    let currentChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'fox jumped over',
      match: false
    };

    expect(
      clip({
        curr: currentChunk,
        next: nextChunk,
        prev: null,
        clipBy: 2
      })
    ).toEqual('... jumped over');
  });

  test('It returns the current chunk text in all other cases', () => {
    let currentChunk: HighlightWords.Chunk = {
      key: '1',
      text: 'fox jumped over',
      match: false
    };

    expect(
      clip({
        curr: currentChunk,
        next: null,
        prev: null,
        clipBy: 2
      })
    ).toEqual('fox jumped over');
  });
});
