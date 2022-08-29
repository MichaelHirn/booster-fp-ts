# booster-fp-ts

## Development

This is a [Deno](https://deno.land/) repo and builds ESM/Deno and NPM/Node (via [dnt](https://github.com/denoland/dnt)) modules.

#### Linting / Formatting

This repository uses Deno's linter and formatter. You can check with `deno fmt --check`, `deno lint`. You can format with `deno fmt`.

#### Commit Message Semantics

This repository is using and validating against the [conventional commit message syntax](https://www.conventionalcommits.org/en/v1.0.0/).

#### Testing / Coverage

This repository uses Deno's test runner. You can test with `deno task test` and customize via  `deno task test -- --your-flags`, e.g. to generate coverage report `deno task test -- --coverage=cov/`.

#### Release/Deployment

This repository uses [semantic release](https://github.com/semantic-release/semantic-release). Qualified merges into the `master` branch result in a new release. For more info checkout the semantic-release workflow action in the .github folder and the semantic-release documentation.
