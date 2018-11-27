"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = __importStar(require("typescript"));
/**
 * Creates an instance of serializer.
 * @param symbol
 * @param typeChecker
 */
var Serializer = /** @class */ (function () {
    function Serializer(symbol, typeChecker) {
        this.symbol = symbol;
        this.typeChecker = typeChecker;
    }
    /** Serialize a symbol into a json object */
    /**
     * Serializes symbol
     * @param symbol
     * @returns symbol
     */
    Serializer.prototype.serializeSymbol = function (symbol) {
        return {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment(this.typeChecker)),
            type: this.typeChecker.typeToString(this.typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)),
        };
    };
    /** Serialize a class symbol information */
    /**
     * Serializes class
     * @param symbol
     * @returns IJSONOutput
     */
    Serializer.prototype.serializeClass = function (symbol) {
        var details = this.serializeSymbol(symbol);
        // Get the construct signatures
        var constructorType = this.typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        details.constructors = constructorType
            .getConstructSignatures()
            .map(this.serializeSignature);
        return details;
    };
    /** Serialize a signature (call or construct) */
    /**
     * Serializes signature
     * @param signature
     * @returns
     */
    Serializer.prototype.serializeSignature = function (signature) {
        return {
            parameters: signature.parameters.map(this.serializeSymbol),
            returnType: this.typeChecker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment(this.typeChecker)),
        };
    };
    return Serializer;
}());
exports.Serializer = Serializer;
var Walker = /** @class */ (function () {
    /**
     * Creates an instance of walker.
     * @param nodes
     * @param typeChecker
     * @param output
     */
    // TODO: Something doesnt work with constructor. checker is undefined here
    function Walker(nodes, checker, output) {
        this._isNodeExported = true;
        this.nodes = nodes;
        this.typeChecker = checker;
        this.output = output;
        this.serializer = undefined;
    }
    Walker.prototype._checkNodeExport = function (node) {
        return ((ts.getCombinedModifierFlags(node) &
            ts.ModifierFlags.Export) !==
            0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile));
    };
    Walker.prototype.walk = function (node) {
        if (this._checkNodeExport) {
            this._isNodeExported = false;
            return;
        }
        var checker = this.typeChecker;
        if (ts.isClassDeclaration(node) && node.name) {
            // This is a top level class, get its symbol
            var symbol = checker.getSymbolAtLocation(node.name);
            this.serializer = new Serializer(symbol, this.typeChecker);
            if (symbol) {
                this.output.push(this.serializer.serializeClass(symbol));
            }
            // No need to walk any further, class expressions/inner declarations
            // cannot be exported
        }
        else if (ts.isModuleDeclaration(node)) {
            // This is a namespace, visit its children
            ts.forEachChild(node, this.walk);
        }
    };
    /**
     * Gets output
     * @returns IJSONOuput[]
     */
    Walker.prototype.getOutput = function () {
        return this.output;
    };
    return Walker;
}());
exports.Walker = Walker;
/**
 * Gets jsondocumentation
 * @param fileNames
 * @param options
 * @returns jsondocumentation
 */
function getJSONdocumentation(fileNames, options) {
    var program = ts.createProgram(fileNames, options);
    // Get the checker, we will use it to find more about classes
    var checker = program.getTypeChecker();
    var output = [];
    var sourceFiles = program.getSourceFiles();
    // const walker = new Walker(sourceFiles, typeChecker, output);
    // Visit every sourceFile in the program
    for (var _i = 0, sourceFiles_1 = sourceFiles; _i < sourceFiles_1.length; _i++) {
        var sourceFile = sourceFiles_1[_i];
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
    function visit(node) {
        // Only consider exported nodes
        if (!isNodeExported(node)) {
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
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)),
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
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment(checker)),
        };
    }
    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node) {
        return ((ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile));
    }
}
exports.getJSONdocumentation = getJSONdocumentation;
