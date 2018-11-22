"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
var ts = __importStar(require("typescript"));
var fs = __importStar(require("fs"));
var TsAST = /** @class */ (function () {
    function TsAST(tsConfig, fileNames) {
        this.fileNames = fileNames;
        this.tsConfig = tsConfig;
    }
    TsAST.prototype.init = function () {
        var compilerHost = ts.createCompilerHost(this.tsConfig, true);
        var program = ts.createProgram(this.fileNames, this.tsConfig, compilerHost);
        var checker = program.getTypeChecker();
        var output = [];
        function visit(node) {
            // Only consider exported nodes
            if ((ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
                (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)) {
                return;
            }
            if (ts.isClassDeclaration(node) && node.name) {
                // This is a top level class, get its symbol
                var symbol = checker.getSymbolAtLocation(node.name);
                if (symbol) {
                    output.push(serializeClass(symbol));
                }
                // No need to walk any further, class expressions/inner declarations
                // cannot be exported
            }
            else if (ts.isModuleDeclaration(node)) {
                // This is a namespace, visit its children
                ts.forEachChild(node, visit);
            }
        }
        /** Serialize a symbol into a json object */
        function serializeSymbol(symbol) {
            return {
                documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
                name: symbol.getName(),
                type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
            };
        }
        /** Serialize a class symbol information */
        function serializeClass(symbol) {
            var details = serializeSymbol(symbol);
            // Get the construct signatures
            var constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
            details.constructors = constructorType
                .getConstructSignatures()
                .map(serializeSignature);
            return details;
        }
        /** Serialize a signature (call or construct) */
        function serializeSignature(signature) {
            return {
                documentation: ts.displayPartsToString(signature.getDocumentationComment(checker)),
                parameters: signature.parameters.map(serializeSymbol),
                returnType: checker.typeToString(signature.getReturnType()),
            };
        }
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var sourceFile = _a[_i];
            if (!sourceFile.isDeclarationFile) {
                ts.forEachChild(sourceFile, visit);
            }
        }
        fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));
        return;
    };
    return TsAST;
}());
exports.default = TsAST;
