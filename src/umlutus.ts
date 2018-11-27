import { getJSONdocumentation, IJSONOuput } from "./parser";
import { } from "./umlBuilder"
import * as ts from "typescript"

export function umlutus(sourceFilesPaths: string[], tsConfigPath: ts.CompilerOptions) {
    const output: IJSONOuput[] = getJSONdocumentation(sourceFilesPaths, tsConfigPath)
    console.log("output is ", output);

}

umlutus(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
})
