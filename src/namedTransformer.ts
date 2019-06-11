import TS, * as ts from 'typescript';
import { ArrowFunction, Node, SourceFile, TransformationContext, TransformerFactory } from 'typescript';

export interface ConfigSet {
  compilerModule?: typeof TS;
}

function visitNode(node: Node, ts: typeof TS) {
  if (node == null) return node;
  if (ts.isCallExpression(node)) {
    if (node.expression.getText() === 'named') {
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
    if (node.moduleSpecifier.getText() === "'ts-named'") {
      return undefined;
    }
  }
  return node;
}

export function visitSourceFile(sourceFile: SourceFile, context: TransformationContext, ts: typeof TS) {
  function visitNodeAndChildren(node: Node): undefined | Node {
    if (node == null) return node;
    node = ts.visitEachChild(node, childNode => visitNodeAndChildren(childNode), context);
    return visitNode(node, ts);
  }

  return visitNodeAndChildren(sourceFile);
}

export function createTransformerFactory(cs: ConfigSet): TransformerFactory<SourceFile> {
  return context => file => visitSourceFile(file, context, cs.compilerModule || ts) as SourceFile;
}

export function namedTransformer(pluginOptions: ConfigSet = {}): TransformerFactory<SourceFile> {
  return (context: TransformationContext) => (file: SourceFile) =>
    visitSourceFile(file, context, pluginOptions.compilerModule || ts) as SourceFile;
}
