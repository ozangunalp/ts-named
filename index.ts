import { SourceFile, TransformerFactory } from 'typescript';
import { ConfigSet, createTransformerFactory, namedTransformer } from './src/namedTransformer';

export declare function named<T>(idF: (id: string) => T): T;

export declare const name: string;

interface Transformer {
  (): TransformerFactory<SourceFile>;

  factory: (cs: ConfigSet) => TransformerFactory<SourceFile>;
}

const transformer: Transformer = namedTransformer as Transformer;
// pass the config set which contains the compiler module
transformer.factory = (cs: Partial<ConfigSet>) => createTransformerFactory(cs);

export default transformer;
