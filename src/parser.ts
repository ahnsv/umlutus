import * as ts from "typescript";
import { type } from "os";
import fs from "fs";

/**
 * Ioutput
 */
export interface IOutput {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: IOutput[];
  parameters?: IOutput[];
  returnType?: string;
}

/**
 * Creates an instance of serializer.
 * @param symbol
 * @param typeChecker
 */
export class Serializer {
  symbol: ts.Symbol;
    typeChecker: ts.TypeChecker;
  constructor(symbol: ts.Symbol, typeChecker: ts.TypeChecker) {
    this.symbol = symbol;
    this.typeChecker = typeChecker
  }

  /** Serialize a symbol into a json object */
  /**
   * Serializes symbol
   * @param symbol
   * @returns symbol
   */
  serializeSymbol(symbol: ts.Symbol): IOutput {
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
    node: ts.Node;
    checker: ts.TypeChecker
    private isNodeExported = false

    /**
     * Creates an instance of walker.
     * @param node
     * @param checker
     */
    constructor(node: ts.Node, checker: ts.TypeChecker) {
        this.node = node
        this.checker = checker
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
            const symbol = this.checker.getSymbolAtLocation(node.name);
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
}

export function getJSONdocumentation(fileNames: string[], options: ts.CompilerOptions) {
    const program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
    const checker = program.getTypeChecker();

    const output: IOutput[] = [];

  // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit);
    }
  }

  // print out the doc
    fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));
}
