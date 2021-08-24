import buildRegexp, { regexpQuery } from '../regexp';

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

describe('Build the regular expression', () => {
  test('Using a string', () => {
    expect(buildRegexp({ terms: 'quick brown fox' })).toEqual(
      /(quick|brown|fox)/gi
    );
    expect(buildRegexp({ terms: 'quick' })).toEqual(/(quick)/gi);
  });

  test('Using a regular expression as a string', () => {
    expect(buildRegexp({ terms: '/(quick)/' })).toEqual(/(quick)/);
    expect(buildRegexp({ terms: '/(brown)/g' })).toEqual(/(brown)/g);
    expect(buildRegexp({ terms: '/(fox)/gi' })).toEqual(/(fox)/gi);
    expect(buildRegexp({ terms: '/com.mycompany.com[.0-9a-z]+/gi' })).toEqual(
      /com.mycompany.com[.0-9a-z]+/gi
    );
  });

  test('Throw if using anything other than a string or regular expression', () => {
    expect(() => {
      // @ts-expect-error terms should be string
      buildRegexp({});
    }).toThrowErrorMatchingInlineSnapshot(
      `"Expected terms to be either a string or a RegExp!"`
    );
    expect(() => {
      // @ts-expect-error terms should be string
      buildRegexp({ terms: [] });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Expected terms to be either a string or a RegExp!"`
    );
    expect(() => {
      // @ts-expect-error terms should be string
      buildRegexp(2);
    }).toThrowErrorMatchingInlineSnapshot(
      `"Expected terms to be either a string or a RegExp!"`
    );
  });
});
