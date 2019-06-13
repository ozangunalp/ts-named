import * as ts from 'typescript';
import { namedTransformer } from '../src/namedTransformer';

let source = `
import { named } from 'ts-named';
export const named1 = named(id => ({ id: id, type: "Type"}));
console.log(named1.id === 'named1');
`;

let source2 = `
import { named } from "ts-named";
class Typed {
  public id: string;
  public type: string;

  public constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }
}

export const named1 = named(id => new Typed(id, 'other'));
console.log(named1.id === 'named1');
`;

let source3 = `
import { named } from 'ts-named';

const named1 = named(id => {
  let i = id;
  return { id: i, type: 'Other' }
});
console.log(named1.id === 'named1');
`;

let source4 = `
import { named } from 'ts-named';

class Typed {
  readonly named1 = named(id => ({ id: id, type: "Type"}));
  readonly named2 = named(id => ({ id: id, type: "Other Type"}));

}
const typed = new Typed()
console.log(typed.named1.id === 'named1');
console.log(typed.named2.id === 'named2');
`;

describe('blah', () => {
  it('works', () => {
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
  it('works2', () => {
    let result = ts.transpileModule(source2, {
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
  it('works3', () => {
    let result = ts.transpileModule(source3, {
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
  it('works4', () => {
    let result = ts.transpileModule(source4, {
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
