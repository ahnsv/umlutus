import * as ts from "typescript"
import TsAST from "./ast"

const ast = new TsAST({
    module: ts.ModuleKind.CommonJS,
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
}, "../example")
ast.init()