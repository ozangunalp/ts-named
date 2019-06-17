import * as ts from 'typescript';
import { namedTransformer } from '../src/namedTransformer';

let source = `
import { named, ID } from "ts-named";
class Typed {
  public id: string;
  public type: string;
  
  readonly static named2 = new Typed(ID, 'other');
  readonly static named3 = named(id => new Typed(id, 'other'));

  public constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }
}

export const named1 = new Typed(ID, 'other');
console.log(Typed.named2.id === 'named2');
console.log(Typed.named3.id === 'named3');
console.log(named1.id === 'named1');
`;

describe('name test', () => {
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
});
