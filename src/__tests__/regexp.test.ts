import regexpQuery from '../regexp';

describe('Create a string to be used as a regular expression', () => {
  test('Create an empty capturing group when the terms is an empty string', () => {
    const terms = '';
    expect(regexpQuery({ terms })).toEqual('()');
  });

  test('Create a single word regexp', () => {
    const terms = 'fox';
    expect(regexpQuery({ terms })).toEqual('(fox)');
  });

  test('Create a multi word regexp', () => {
    const terms = 'quick brown fox';
    expect(regexpQuery({ terms })).toEqual('(quick|brown|fox)');
  });

  test('Create a multi word regexp as an exact match', () => {
    const terms = 'quick brown fox';
    expect(regexpQuery({ terms, matchExactly: true })).toEqual(
      '(quick brown fox)'
    );
  });

  test('Make sure any disallowed characters are stripped', () => {
    const terms = '$quick [brown (fox)';
    expect(regexpQuery({ terms })).toEqual('(\\$quick|\\[brown|\\(fox\\))');
  });

  test('Throw an error when trying to create a regexp not from a string', () => {
    expect(() => {
      // @ts-expect-error terms should be string
      regexpQuery({ terms: {} });
    }).toThrow(TypeError);

    expect(() => {
      // @ts-expect-error terms should be string
      regexpQuery({ terms: {} });
    }).toThrow(/string/);
  });

  test('Make sure any leading and trailing white space is cut off', () => {
    expect(regexpQuery({ terms: 'fox ' })).toEqual('(fox)');
    expect(regexpQuery({ terms: ' fox' })).toEqual('(fox)');
    expect(regexpQuery({ terms: ' fox ' })).toEqual('(fox)');
  });
});
