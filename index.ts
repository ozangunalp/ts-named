import { SourceFile, TransformerFactory } from 'typescript';
import { ConfigSet, createTransformerFactory, namedTransformer } from './src/namedTransformer';

export declare function named<T>(idF: (id: string) => T): T;

interface Transformer {
  (): TransformerFactory<SourceFile>;

  factory: (cs: ConfigSet) => TransformerFactory<SourceFile>;
}

const transformer: Transformer = namedTransformer as Transformer;
// pass the config set which contains the compiler module
transformer.factory = (cs: ConfigSet) => createTransformerFactory(cs);

export default transformer;
