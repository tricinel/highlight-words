# Contributing

**First off: thanks! Open source software (and thus all software) exists because
of people like you. ❤️**

## What is highlight-words

**highlight-words** is a small package that turns a piece of text and a search query into chunks separating matches from non-matches, allowing you to highlight the matches, visually or otherwise, in your app.

## Project setup

1. Fork and clone the repo
2. `$ yarn install` to install dependencies
3. Create a branch for your PR

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```sh
> git remote add upstream https://github.com/tricinel/highlight-words.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`. Then you
> can make all of your pull request branches based on this `master` branch.
> Whenever you want to update your version of `master`, do a regular `git pull`.

## Committing and Pushing changes

Please make sure to run the tests before you commit your changes, as well as do any linting, formatting and typechecking. You can manually do this like so:

```sh
yarn test
yarn lint
yarn format
yarn typecheck
```

We're using `husky` to run these commands on the pre-push hook anyway :)

# Filing issues

Please [check the existing issues][issues] to make sure your issue hasn't
already been filed.

If you have a bug to report, please file it.

If you'd like to see a feature implemented, you can file an issue, but help is
always appreciated.

[issues]: https://github.com/tricinel/highlight-words/issues
