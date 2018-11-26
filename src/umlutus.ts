import { getJSONdocumentation } from "./parser"
import { } from "./umlBuilder"
import * as ts from "typescript"

export function umlutus(sourceFilesPaths: string[], tsConfigPath: ts.CompilerOptions) {
    getJSONdocumentation(sourceFilesPaths, tsConfigPath)
}

umlutus(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
})
