import * as ts from 'typescript';
import { namedTransformer } from '../src/namedTransformer';
import fs from 'fs';
import path from 'path';

const source = fs.readFileSync(path.resolve(__dirname, 'static-class.ts'), 'utf8');

describe('static class', () => {
  it('compiles', () => {
    let result = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        paths: {
          '*': ['../src/*'],
        },
        target: ts.ScriptTarget.ESNext,
      },
      transformers: { before: [namedTransformer()] },
    });
    console.log(result.outputText);
    eval(result.outputText);
  });
});
