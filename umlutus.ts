import * as ts from "typescript"
import AST from "./ast"

const ast = new AST({
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
}, process.argv.slice(2))

ast.init()