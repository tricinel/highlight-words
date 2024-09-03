### v2.0.0

---

#### Breaking changes:
- Switch to Node20
- Switch compile target from ES5 to ES2020

#### Chores:
- Switch from eslint and prettier to biome
- Switch from jest to vitest
- Switch from husky to lefthook
- Remove yarn
- Drop stryker mutation testing
- Update all dependencies

### v1.2.2

---

- Fix module resolution for Node16 (fixes #30)

### v1.2.1

---

- Fix regex when searching for string with two or more spaces (fixes #25)

### v1.2.0

---

- Allow regular expression patterns to be used as a query

### v1.1.0

---

- Switch to new build system
- Drop umd support

### v1.0.6

---

- Improve a little bit the internals using the new eslint rules
- Update dependencies

### v1.0.5

---

- Clip now handles the case when both the next and the previous chunks are a match and there are enough words in the current match to clip by

### v1.0.4

---

- Small fix to make sure we don't match when the query is just a bunch of white space

### v1.0.2

---

- Small fix to regexp builder to trim any leading and trailing white space

### v1.0.1

---

- Small fix to the modules path in package.json

### v1.0.0

---

- Yay. First release :)
