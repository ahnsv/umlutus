// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
import * as ts from "typescript"
import * as fs from "fs"

// const tsConfig: ts.CompilerOptions = {
//     module: ts.ModuleKind.CommonJS,
//     noEmitOnError: true,
//     noImplicitAny: true,
//     target: ts.ScriptTarget.ES5,
// };
interface IDocEntry {
    name?: string;
    fileName?: string;
    documentation?: string;
    type?: string;
    constructors?: IDocEntry[];
    parameters?: IDocEntry[];
    returnType?: string;
}
export default class TsAST {
    fileNames: string[];
    tsConfig: ts.CompilerOptions;
    constructor(tsConfig: ts.CompilerOptions, fileNames: string[]) {
        this.fileNames = fileNames
        this.tsConfig = tsConfig
    }
    init() {
        const compilerHost = ts.createCompilerHost(this.tsConfig, true)
        const program = ts.createProgram(this.fileNames, this.tsConfig, compilerHost)
        const checker = program.getTypeChecker()
        const output: IDocEntry[] = [];

        function visit(node: ts.Node) {
            // Only consider exported nodes

            if (
                (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
                (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
            ) {
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
        function serializeSymbol(symbol: ts.Symbol): IDocEntry {
            return {
                documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
                name: symbol.getName(),
                type: checker.typeToString(
                    checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
                )
            };
        }

        /** Serialize a class symbol information */
        function serializeClass(symbol: ts.Symbol) {
            const details = serializeSymbol(symbol);

            // Get the construct signatures
            const constructorType = checker.getTypeOfSymbolAtLocation(
                symbol,
                symbol.valueDeclaration!
            );
            details.constructors = constructorType
                .getConstructSignatures()
                .map(serializeSignature);
            return details;
        }

        /** Serialize a signature (call or construct) */
        function serializeSignature(signature: ts.Signature) {
            return {
                documentation: ts.displayPartsToString(signature.getDocumentationComment(checker)),
                parameters: signature.parameters.map(serializeSymbol),
                returnType: checker.typeToString(signature.getReturnType()),
            };
        }
        for (const sourceFile of program.getSourceFiles()) {
            if (!sourceFile.isDeclarationFile) {
                ts.forEachChild(sourceFile, visit);
            }
        }

        fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));

        return;
    }
}