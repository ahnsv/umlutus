"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_simple_ast_1 = require("ts-simple-ast");
var ts = __importStar(require("typescript"));
function parse(tsConfigFilePath, directoryPath) {
    var project = new ts_simple_ast_1.Project({
        tsConfigFilePath: tsConfigFilePath
    });
    var directory = project.getDirectoryOrThrow(directoryPath);
    var sourceFiles = directory.getSourceFiles();
    for (var _i = 0, sourceFiles_1 = sourceFiles; _i < sourceFiles_1.length; _i++) {
        var sourceFile = sourceFiles_1[_i];
        sourceFile.forEachChild(function (child) {
            switch (child.getKind()) {
                case ts_simple_ast_1.SyntaxKind.ClassDeclaration:
                    console.log("class found!");
                    parseClassNode(child);
                    break;
                case ts_simple_ast_1.SyntaxKind.EnumDeclaration:
                    console.log("enum found!");
                    child.getFullText();
                    break;
                default:
                    child.getFullText();
                    break;
            }
        });
    }
}
exports.default = parse;
function parseClassNode(node) {
    switch (node.getKind()) {
        case ts.SyntaxKind.PropertyDeclaration:
            console.log("====================================");
            console.log("property declaration");
            console.log("====================================");
            break;
        case ts.SyntaxKind.ExtendsKeyword:
        case ts.SyntaxKind.StaticKeyword:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            break;
        case ts.SyntaxKind.MethodDeclaration:
            console.log("====================================");
            console.log("method declaration");
            console.log("====================================");
            break;
        default:
            console.log("====================================");
            console.log("default hi");
            console.log("====================================");
            node.forEachChild(function (n) { parseClassNode.bind(n); });
            break;
    }
}
function parseEnumNode(node) { }
function parseInterfaceNode(node) { }
