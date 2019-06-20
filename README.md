# Ts-Named : TypeScript Transformer for extracting variable name

[![npm version](https://badge.fury.io/js/ts-named.svg)](https://badge.fury.io/js/ts-named)
[![Build Status](https://travis-ci.org/ozangunalp/ts-named.svg?branch=master)](https://travis-ci.org/ozangunalp/ts-named)

`ts-named` provides two types of transformations for extracting identifiers from named variables into strings,
which will escape [variable name mangling](https://en.wikipedia.org/wiki/Name_mangling) applied by tools like
Terser or UglifyJS and will be conserved for runtime use.

##`named` function

#### Transforms :

```typescript
import { named } from 'ts-named';
// ...
const SOME_ID = named(id => ({ ID: id, TYPE: 'Typed' }));

console.log(SOME_ID.ID);
```

#### To :

```typescript
const SOME_ID = (id => ({ ID: id, TYPE: 'Typed' }))('SOME_ID');

console.log(SOME_ID.ID); // "SOME_ID"
```

## `ID` constant

#### Transforms :

```typescript
import { ID } from 'ts-named';
// ...
const SOME_ID = { ID: ID, TYPE: 'Typed' };

console.log(SOME_ID.ID);
```

#### To :

```typescript
const SOME_ID = { ID: 'SOME_ID', TYPE: 'Typed' };

console.log(SOME_ID.ID); // "SOME_ID"
```

## Usage

`named` function is a declared function that receives an arrow function as parameter :

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

`ID` constant is a declared string constant :

```typescript
export declare const ID: string;
```

Its usages are replaced during the transformation with the englobing variable assignments identifier :

```typescript
import { ID } from 'ts-named';
class MyObject {
  constructor(public name: string) {}
}
const SOME_ID = new MyObject(ID);
```

## Configuration

TypeScript compiler does not provide a standard way of including AST transformers to the tsc.
You need to configure the build tool you use.

### Webpack

```js
const tsNamed = require('ts-named');

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
              getCustomTransformers: () => ({ before: [tsNamed()] }),
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
const tsNamed = require('ts-named');

gulp.task('typescript', function() {
  gulp
    .src('src/**/*.ts')
    .pipe(
      ts({
        getCustomTransformers: () => ({ before: [tsNamed()] }),
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

For example to use ttypescript with Webpack,

```js
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader', // or awesome-typescript-loader
              options: {
                  compiler: 'ttypescript'
              }
          },
        ],
      },
    ],
```
