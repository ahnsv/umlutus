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
    this.typeChecker = typeChecker;
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
        this.typeChecker.getTypeOfSymbolAtLocation(
          symbol,
          symbol.valueDeclaration!,
        ),
      ),
    };
  }

  /** Serialize a class symbol information */
  /**
   * Serializes class
   * @param symbol
   * @returns IJSONOutput
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
  public typeChecker: ts.TypeChecker;
  private _isNodeExported = true;
  output: IJSONOuput[];
  serializer: Serializer | undefined;
  /**
   * Creates an instance of walker.
   * @param nodes
   * @param typeChecker
   * @param output
   */
  // TODO: Something doesnt work with constructor. checker is undefined here
  constructor(nodes: ts.Node[], checker: ts.TypeChecker, output: IJSONOuput[]) {
    this.nodes = nodes;
    this.typeChecker = checker;
    this.output = output;
    this.serializer = undefined;
  }
  private _checkNodeExport(node: ts.Node) {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) &
        ts.ModifierFlags.Export) !==
        0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }
  walk(node: ts.Node) {
    if (this._checkNodeExport) {
      this._isNodeExported = false;
      return;
    }
    const checker = this.typeChecker;
    if (ts.isClassDeclaration(node) && node.name) {
      // This is a top level class, get its symbol
      const symbol = checker.getSymbolAtLocation(node.name);
      this.serializer = new Serializer(symbol, this.typeChecker);
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

  /**
   * Gets output
   * @returns IJSONOuput[]
   */
  getOutput() {
    return this.output;
  }
}

/**
 * Gets jsondocumentation
 * @param fileNames
 * @param options
 * @returns jsondocumentation
 */
export function getJSONdocumentation(
  fileNames: string[],
  options: ts.CompilerOptions,
): IJSONOuput[] {
  const program = ts.createProgram(fileNames, options);
  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();
  const output: IJSONOuput[] = [];
  const sourceFiles = program.getSourceFiles() as ts.SourceFile[];
  // const walker = new Walker(sourceFiles, typeChecker, output);

  // Visit every sourceFile in the program
  for (const sourceFile of sourceFiles) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit);
    }
  }
  // console.log("output is ", walker.getOutput());
  // print out the doc
  // fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));
  return output;

  /** visit nodes finding exported classes */
  function visit(node: ts.Node) {
    // Only consider exported nodes
    if (!isNodeExported(node)) {
      return;
    }

    if (ts.isClassDeclaration(node) && node.name) {
      // This is a top level class, get its symbol
      const symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        output.push(serializeClass(symbol));
      }
      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    } else if (ts.isModuleDeclaration(node)) {
      // This is a namespace, visit its children
      ts.forEachChild(node, visit);
    }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol): IJSONOuput {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!),
      ),
    };
  }

  /** Serialize a class symbol information */
  function serializeClass(symbol: ts.Symbol) {
    const details = serializeSymbol(symbol);

    // Get the construct signatures
    const constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!,
    );
    details.constructors = constructorType
      .getConstructSignatures()
      .map(serializeSignature);
    return details;
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType()),
      documentation: ts.displayPartsToString(signature.getDocumentationComment(checker)),
    };
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Node): boolean {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }
}
