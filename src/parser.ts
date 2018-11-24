import Ast, * as simpleAst from "ts-simple-ast"

export function getAst(tsConfigPath: string, sourceFilesPaths?: string[]) {
    const ast = new Ast({
        addFilesFromTsConfig: !Array.isArray(sourceFilesPaths),
        tsConfigFilePath: tsConfigPath,
    });
    if (sourceFilesPaths) {
        ast.addExistingSourceFiles(sourceFilesPaths);
    }
    return ast;
}

type Declarations = simpleAst.ClassDeclaration & simpleAst.EnumDeclaration & simpleAst.InterfaceDeclaration
type PropMethodDeclarations = simpleAst.PropertyDeclaration | simpleAst.MethodDeclaration

function getSymbols(declarations: PropMethodDeclarations[]) {
    return declarations.map(prop => {
        if (prop.getSymbol) { return { name: prop.getName() } }
    }).filter(p => p !== undefined)
}

export function parseDeclaration<T>(declaration: Declarations) {
    const propertyDeclarations = declaration.getProperties()
    const name = declaration.getName()
    const methodDeclarations = declaration.getMethods()
    const properties = getSymbols(propertyDeclarations)
    const methods = getSymbols(methodDeclarations)
    return { name, properties, methods }
}
