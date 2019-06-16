import TS, * as ts from 'typescript';
import {
  ArrowFunction,
  NamedImports,
  Node,
  PropertyAssignment,
  PropertyDeclaration,
  SourceFile,
  TransformationContext,
  TransformerFactory,
  VariableDeclaration,
} from 'typescript';

const moduleName = 'ts-named';

export interface ConfigSet {
  compilerModule: typeof TS;
  tsNamedModule: string;
}

function equalsWrappedText(wrappedValue: string, expected: string): boolean {
  return wrappedValue === `'` + expected + `'` || wrappedValue === `"` + expected + `"`;
}

type IdentifiedDeclaration = VariableDeclaration | PropertyDeclaration | PropertyAssignment;

function isIdentifiedDeclarationOrPropertyAssignment(ts: typeof TS, node: Node): node is IdentifiedDeclaration {
  if (node === undefined) {
    return false;
  }
  return (
    ts.isVariableDeclaration(node) || // const v = named(id => ...)
    ts.isPropertyDeclaration(node) || // class C { v = named(id => ...) }
    ts.isPropertyAssignment(node) // const c = { p: named(id => ...) }
  );
}

function isIdentifiedDeclaration(ts: typeof TS, node: Node): node is VariableDeclaration | PropertyDeclaration {
  if (node === undefined) {
    return false;
  }
  return ts.isVariableDeclaration(node) || ts.isPropertyDeclaration(node);
}

const namedFunction = 'named';
let namedFunctionBinding: string;
const nameProperty = 'name';
let namePropertyBinding: string;

function visitNode(node: Node, pluginOptions: ConfigSet) {
  const ts = pluginOptions.compilerModule;
  if (node == null) return node;
  if (ts.isCallExpression(node)) {
    if (node.expression.getText() === namedFunctionBinding) {
      if (isIdentifiedDeclarationOrPropertyAssignment(ts, node.parent)) {
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
          // import { named } || { named as .. }
          if ((value.propertyName || value.name).text === namedFunction) {
            namedFunctionBinding = value.name.text;
          }
          // import { name } || { name as .. }
          if ((value.propertyName || value.name).text === nameProperty) {
            namePropertyBinding = value.name.text;
          }
        });
      }
      return undefined;
    }
  }
  if (ts.isIdentifier(node) && node.getText() === namePropertyBinding) {
    let n: Node = node;
    while (!isIdentifiedDeclaration(ts, n)) {
      n = n.parent;
      if (n === undefined) {
        return node;
      }
    }
    return ts.createStringLiteral(n.name.getText());
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
      tsNamedModule: cs.tsNamedModule || moduleName,
    }) as SourceFile;
}

export function namedTransformer(pluginOptions: Partial<ConfigSet> = {}): TransformerFactory<SourceFile> {
  return (context: TransformationContext) => (file: SourceFile) =>
    visitSourceFile(file, context, {
      compilerModule: pluginOptions.compilerModule || ts,
      tsNamedModule: pluginOptions.tsNamedModule || moduleName,
    }) as SourceFile;
}
