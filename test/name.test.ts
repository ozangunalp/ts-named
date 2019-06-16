import * as ts from 'typescript';
import { namedTransformer } from '../src/namedTransformer';

let source = `
import { name as id } from "ts-named";
class Typed {
  public id: string;
  public type: string;
  
  readonly static named2 = new Typed(id, 'other');

  public constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }
}

export const named1 = new Typed(id, 'other');
console.log(Typed.named2.id === 'named2');
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
