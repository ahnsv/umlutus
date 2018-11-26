import * as ts from "typescript";
import fs from "fs";

export interface IJSONOuput {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: IJSONOuput[];
  parameters?: IJSONOuput[];
  returnType?: string;
}

/**
 * Creates an instance of serializer.
 * @param symbol
 * @param typeChecker
 */
export class Serializer {
  symbol: ts.Symbol | undefined;
  typeChecker: ts.TypeChecker;
  constructor(symbol: ts.Symbol | undefined, typeChecker: ts.TypeChecker) {
    this.symbol = symbol;
    this.typeChecker = typeChecker
  }

  /** Serialize a symbol into a json object */
  /**
   * Serializes symbol
   * @param symbol
   * @returns symbol
   */
  serializeSymbol(symbol: ts.Symbol): IJSONOuput {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(
        symbol.getDocumentationComment(this.typeChecker),
      ),
      type: this.typeChecker.typeToString(
        this.typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!),
      ),
    };
  }

  /** Serialize a class symbol information */
  /**
   * Serializes class
   * @param symbol
   * @returns
   */
  serializeClass(symbol: ts.Symbol) {
    const details = this.serializeSymbol(symbol);

    // Get the construct signatures
    const constructorType = this.typeChecker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!,
    );
    details.constructors = constructorType
      .getConstructSignatures()
      .map(this.serializeSignature);
    return details;
  }

  /** Serialize a signature (call or construct) */
  /**
   * Serializes signature
   * @param signature
   * @returns
   */
  serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(this.serializeSymbol),
      returnType: this.typeChecker.typeToString(signature.getReturnType()),
      documentation: ts.displayPartsToString(
        signature.getDocumentationComment(this.typeChecker),
      ),
    };
  }
}

export class Walker {
  nodes: ts.Node[];
  private typeChecker: ts.TypeChecker
  private isNodeExported = false
  output: IJSONOuput[];
  serializer: Serializer | undefined
  /**
   * Creates an instance of walker.
   * @param nodes
   * @param typeChecker
   * @param output
   */
  // TODO: Something doesnt work with constructor. checker is undefined here
  constructor(nodes: ts.Node[], checker: ts.TypeChecker, output: IJSONOuput[]) {
    this.nodes = nodes
    this.typeChecker = checker
    this.output = output
    this.serializer = undefined
  }
  private checkNodeExport(node: ts.Node) {
    if (
      (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    ) {
      this.isNodeExported = true
    }
  }
  walk(node: ts.Node) {
    if (ts.isClassDeclaration(node) && node.name) {
      // This is a top level class, get its symbol
      const symbol = this.typeChecker.getSymbolAtLocation(node.name);
      this.serializer = new Serializer(symbol, this.typeChecker)
      if (symbol) {
        this.output.push(this.serializer.serializeClass(symbol));
      }
      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    } else if (ts.isModuleDeclaration(node)) {
      // This is a namespace, visit its children
      ts.forEachChild(node, this.walk);
    }
  }

  getOutput() {
    return this.output
  }
}

export function getJSONdocumentation(fileNames: string[], options: ts.CompilerOptions) {
  const program = ts.createProgram(fileNames, options);
  // Get the checker, we will use it to find more about classes
  const typeChecker = program.getTypeChecker();
  const output: IJSONOuput[] = [];
  const sourceFiles = program.getSourceFiles() as ts.SourceFile[]
  const walker = new Walker(sourceFiles, typeChecker, output)
  // Visit every sourceFile in the program
  for (const sourceFile of sourceFiles) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, walker.walk);
    }
  }
  console.log("output is ", walker.getOutput())
  // print out the doc
  // fs.writeFileSync("classes.json", JSON.stringify(walker.getOutput(), undefined, 4));
  return walker.getOutput()
}
