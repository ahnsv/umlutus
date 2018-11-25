"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_simple_ast_1 = __importDefault(require("ts-simple-ast"));
function getAst(tsConfigPath, sourceFilesPaths) {
    var ast = new ts_simple_ast_1.default({
        addFilesFromTsConfig: !Array.isArray(sourceFilesPaths),
        tsConfigFilePath: tsConfigPath,
    });
    if (sourceFilesPaths) {
        ast.addExistingSourceFiles(sourceFilesPaths);
    }
    return ast;
}
exports.getAst = getAst;
function getSymbols(declarations) {
    return declarations.map(function (prop) {
        if (prop.getSymbol) {
            return { name: prop.getName() };
        }
    }).filter(function (p) { return p !== undefined; });
}
function parseDeclaration(declaration) {
    var propertyDeclarations = declaration.getProperties();
    var name = declaration.getName();
    var methodDeclarations = declaration.getMethods();
    var properties = getSymbols(propertyDeclarations);
    var methods = getSymbols(methodDeclarations);
    return { name: name, properties: properties, methods: methods };
}
exports.parseDeclaration = parseDeclaration;
