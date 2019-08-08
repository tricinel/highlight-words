Give it a piece of text and a search query, and it splits it into chunks separating matches from non-matches, allowing you to highlight the matches, visually or otherwise, in your app.

![Build status][build-status-badge] ![Node Version][node-version-badge]
![Npm version][npm-version-badge]
[![Npm downloads][npm-downloads-badge]][highlight-words-npm] ![License][license-badge]

## Installation

```
yarn add highlight-words
```

```
npm i --save highlight-words
```

## Usage

To use it, give it the body of text to search in and the query to search for.

```js
import highlightWords from 'highlight-words';

const chunks = highlightWords({
  text: 'The quick brown fox jumped over the lazy dog',
  query: 'over'
});

console.log(chunks);
/*
[
  {
    id: '62acb210-76dd-4682-b948-8d359a966dcb'
    text: 'The brown fox jumped ',
    match: false
  },
  {
    id: '69779adf-6d7c-45ec-ae9b-49d0cb292e28';
    text: 'over',
    match: true
  },
  {
    id: '46c5b7a0-5414-47c5-81ba-2496f33fe2f6';
    text: ' the lazy dog',
    match: false
  }
]
*/
```

[Play with this example on Code Sandbox.](https://codesandbox.io/s/sleepy-tu-ijvkg)

### Options

You can add a few options for the highlighter.

- _clipBy_. If you want to clip the occurences that are not a match and display elipses around them. This can help to provide context around your matches.
- _matchExactly_. By default, the highlighter will look for occurences of either words in your query. For example, if you have `brown fox` as your `query`, the highlighter will consider both `brown` and `fox` as separate matches.

### Arguments

`highlightWords` accepts an object as an argument, with the following structure:

| Property       | Type    | Required? | Description                                                   | Default |
| :------------- | :------ | :-------: | :------------------------------------------------------------ | :------ |
| `text`         | String  |     ✓     | The body of text you want to search in.                       | `empty` |
| `query`        | String  |     ✓     | The word or words you want to search for.                     | `empty` |
| `clipBy`       | Number  |           | How many words do you want to clip from the non matches.      | `null`  |
| `matchExactly` | Boolean |           | Should we match the complete query or individual words in it? | `false` |

### What it returns

`highlightWords` returns an array of objects, each object with the following structure:

| Property | Type    | Description                                                                                             |
| :------- | :------ | :------------------------------------------------------------------------------------------------------ |
| `key`    | String  | A unique key to help you when you want to use the chunks in a map function, e.g. with React or Angular. |
| `text`   | String  | The word or words in the chunk.                                                                         |
| `match`  | Boolean | Is this chunk a match for your search?                                                                  |

## Use it with the framework of your choice

By default, the highlighter won't assume any HTML element to wrap matched text, so you can do whatever you want with the matches.

### React

```jsx
<ul>
  {chunks.map(({ text, match, key }) =>
    match ? (
      <li className="highlight" key={key}>
        {text}
      </li>
    ) : (
      <li key={key}>{text}</li>
    )
  )}
  };
</ul>
```

[Play with the React example on Code Sandbox.](https://codesandbox.io/s/vigorous-ramanujan-1h7qw)

### Angular

```html
<ul>
  <li *ngFor="let chunk of chunks; trackBy: key" class="highlight">
    {{ chunk.text }}
  </li>
</ul>
```

### Vue

```html
<ul>
  <li
    v-for="chunk in chunks"
    :key="chunk.key"
    v-bind:class="{ active: chunk.match }"
  >
    {{ chunk.text }}
  </li>
</ul>
```

## License

MIT License - fork, modify and use however you want.

[node-version-badge]: https://img.shields.io/node/v/highlight-words.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/highlight-words.svg?style=flat-square
[npm-version-badge]: https://img.shields.io/npm/v/highlight-words.svg?style=flat-square
[highlight-words-npm]: https://www.npmjs.com/package/highlight-words
[npm-downloads-badge]: https://img.shields.io/npm/dt/highlight-words.svg?style=flat-square
[build-status-badge]: https://img.shields.io/travis/tricinel/highlight-words.svg?style=flat-square
