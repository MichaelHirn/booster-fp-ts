import { build, emptyDir } from 'https://deno.land/x/dnt@0.23.0/mod.ts';

// create a copy of package-lock.json
Deno.copyFileSync('./npm/package-lock.json', 'package-lock.json');
// nuke everything
await emptyDir('./npm');
// bring saved package-lock.json back
Deno.copyFileSync('package-lock.json', './npm/package-lock.json');
// clean up saved package-lock duplicate
Deno.remove('package-lock.json').catch((_) => {});

await build({
  entryPoints: ['./mod.ts'],
  outDir: './npm',
  typeCheck: true,
  test: true,
  declaration: true,
  shims: {
    // see JS docs for overview and more options
    deno: true,
    weakRef: true,
    // crypto shim doesn't work and throws error:
    // > Property 'randomUUID' does not exist on type 'Crypto'.
    // so we turn it off and use uuid.deno and uuid.node files.
    crypto: false,
  },
  mappings: {
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Either.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Either.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Option.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Option.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Task.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Task.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/TaskEither.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/TaskEither.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/TaskOption.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/TaskOption.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Monoid.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Monoid.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Ord.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Ord.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Date.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Date.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Json.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Json.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Record.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Record.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Set.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Set.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Semigroup.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Semigroup.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Array.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Array.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/NonEmptyArray.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/NonEmptyArray.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/ReadonlyNonEmptyArray.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/ReadonlyNonEmptyArray.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/ReadonlyArray.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/ReadonlyArray.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/Tuple.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/Tuple.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/ReadonlyTuple.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/ReadonlyTuple.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/function.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/function.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/string.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/string.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/number.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/number.js',
    },
    'https://raw.githubusercontent.com/michaelhirn/fp-ts/master/lib/boolean.ts': {
      name: 'fp-ts',
      version: '2.12.1',
      subPath: 'lib/boolean.js',
    },
  },
  package: {
    // package.json properties
    name: '@MichaelHirn/booster-fp-ts',
    version: Deno.args[0]?.replace(/^v/, '') ?? '0.0.1',
    license: 'MIT',
    devDependencies: {
      // required for CI/CD semantic-release step
      '@commitlint/cli': '^11.0.0',
      '@commitlint/config-conventional': '^11.0.0',
      '@semantic-release/changelog': '^5.0.1',
      '@semantic-release/git': '^9.0.1',
      '@semantic-release/github': '^7.2',
      'semantic-release': '^17.4.7',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/MichaelHirn/booster-fp-ts.git',
    },
    bugs: {
      url: 'https://github.com/MichaelHirn/booster-fp-ts/issues',
    },
  },
  compilerOptions: {
    'target': 'ES2020',
  },
});

// post build steps
Deno.copyFileSync('README.md', 'npm/README.md');
