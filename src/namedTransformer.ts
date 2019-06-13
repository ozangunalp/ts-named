import TS, * as ts from 'typescript';
import { ArrowFunction, NamedImports, Node, SourceFile, TransformationContext, TransformerFactory } from 'typescript';

export interface ConfigSet {
  compilerModule: typeof TS;
  tsNamedModule: string;
}

function equalsWrappedText(wrappedValue: string, expected: string): boolean {
  return wrappedValue === `'` + expected + `'` || wrappedValue === `"` + expected + `"`;
}

let importBinding: string;

function visitNode(node: Node, pluginOptions: ConfigSet) {
  const ts = pluginOptions.compilerModule;
  if (node == null) return node;
  if (ts.isCallExpression(node)) {
    if (node.expression.getText() === importBinding) {
      if (
        ts.isVariableDeclaration(node.parent) || // const v = named(id => ...)
        ts.isPropertyDeclaration(node.parent) || // class C { v = named(id => ...) }
        ts.isPropertyAssignment(node.parent) // const c = { p: named(id => ...) }
      ) {
        if (ts.isArrowFunction(node.arguments[0])) {
          let expression = node.arguments[0] as ArrowFunction;
          let statements = null;
          if (ts.isBlock(expression.body)) {
            statements = expression.body.statements;
          } else {
            statements = [ts.createReturn(expression.body)];
          }
          let literal = ts.createStringLiteral(node.parent.name.getText());
          return ts.createImmediatelyInvokedArrowFunction(statements, expression.parameters[0], literal);
        }
      }
    }
  }
  if (ts.isImportDeclaration(node)) {
    if (equalsWrappedText(node.moduleSpecifier.getText(), pluginOptions.tsNamedModule)) {
      const importClause = node.importClause;
      if (importClause) {
        const namedBindings = importClause.namedBindings as NamedImports;
        namedBindings.elements.forEach(value => {
          importBinding = value.name.text;
        });
      }
      return undefined;
    }
  }
  return node;
}

export function visitSourceFile(sourceFile: SourceFile, context: TransformationContext, pluginOptions: ConfigSet) {
  function visitNodeAndChildren(node: Node): undefined | Node {
    if (node == null) return node;
    node = ts.visitEachChild(node, childNode => visitNodeAndChildren(childNode), context);
    return visitNode(node, pluginOptions);
  }

  return visitNodeAndChildren(sourceFile);
}

export function createTransformerFactory(cs: Partial<ConfigSet>): TransformerFactory<SourceFile> {
  return context => file =>
    visitSourceFile(file, context, {
      compilerModule: cs.compilerModule || ts,
      tsNamedModule: cs.tsNamedModule || 'ts-named',
    }) as SourceFile;
}

export function namedTransformer(pluginOptions: Partial<ConfigSet> = {}): TransformerFactory<SourceFile> {
  return (context: TransformationContext) => (file: SourceFile) =>
    visitSourceFile(file, context, {
      compilerModule: pluginOptions.compilerModule || ts,
      tsNamedModule: pluginOptions.tsNamedModule || 'ts-named',
    }) as SourceFile;
}
