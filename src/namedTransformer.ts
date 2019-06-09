import TS, { ArrowFunction, Node, SourceFile, TransformationContext, TransformerFactory } from 'typescript';

export interface ConfigSet {
  compilerModule: typeof TS;
}

export function createTransformerFactory(cs: ConfigSet): TransformerFactory<SourceFile> {
  return context => file => visitSourceFile(file, context, cs.compilerModule) as SourceFile;
}

export const namedTransformer: TransformerFactory<SourceFile> = context => {
  return file => visitSourceFile(file, context, TS) as SourceFile;
};

export function visitSourceFile(sourceFile: SourceFile, context: TransformationContext, ts: typeof TS) {
  return visitNodeAndChildren(sourceFile);

  function visitNodeAndChildren(node: Node): undefined | Node {
    if (node == null) return node;
    node = ts.visitEachChild(node, childNode => visitNodeAndChildren(childNode), context);
    return visitNode(node, ts);
  }
}

function visitNode(node: Node, ts: typeof TS) {
  if (node == null) return node;
  if (ts.isCallExpression(node)) {
    if (node.expression.getText() === 'named') {
      if (ts.isVariableDeclaration(node.parent)) {
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
