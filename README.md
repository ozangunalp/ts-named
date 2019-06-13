# Ts-Named : TypeScript Transformer for extracting variable name

[![npm version](https://badge.fury.io/js/ts-named.svg)](https://badge.fury.io/js/ts-named)
[![Build Status](https://travis-ci.org/ozangunalp/ts-named.svg?branch=master)](https://travis-ci.org/ozangunalp/ts-named)

### Transforms :

```typescript
import { named } from 'ts-named';
// ...
const SOME_ID = named(id => ({ ID: id, TYPE: 'Typed' }));

console.log(SOME_ID.ID);
```

### To :

```typescript
const SOME_ID = (id => ({ ID: id, TYPE: 'Typed' }))('SOME_ID');

console.log(SOME_ID.ID); // "SOME_ID"
```

## Usage

`ts-named` declares a `named` function that receives an arrow function as parameter :

```typescript
export declare function named<T>(idF: (id: string) => T): T;
```

The transformation expects it to be used before a variable declaration as follows :

```typescript
import { named } from 'ts-named';
const SOME_ID = named(id => ({ ID: id, TYPE: 'Typed' }));
```

After the transformation the import and the function usages are removed.
The `named` function usage is replaced with an immediately invoked arrow function (IIAF), with the variable name as argument.

## Configuration

TypeScript compiler does not provide a standard way of including AST transformers to the tsc.
You need to configure the build tool you use.

### Webpack

```js
const named = require('ts-named');

module.exports = {
  // ...etc...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader', // or awesome-typescript-loader
            options: {
              getCustomTransformers: () => ({ before: [named] }),
            },
          },
        ],
      },
    ],
  },
};
```

### Gulp

```js
const gulp = require('gulp');
const ts = require('gulp-typescript');
const named = require('ts-named');

gulp.task('typescript', function() {
  gulp
    .src('src/**/*.ts')
    .pipe(
      ts({
        getCustomTransformers: () => ({ before: [named] }),
      })
    )
    .pipe(gulp.dest('dist'));
});
```

### Jest (with ts-jest)

In `jest.config.js`

```js
    globals: {
        'ts-jest': {
            astTransformers: ['ts-named']
        }
    }
```

### tsc (with ttypescript)

Alternatively you can use the [ttypescript](https://github.com/cevek/ttypescript) wrapper.

In `tsconfig.json`

```json
{
  "compilerOptions": {
    "plugins": [{ "transform": "ts-named" }]
  }
}
```

Then configure different build tools to use the ttypescript instead of tsc, as shown here : https://github.com/cevek/ttypescript
