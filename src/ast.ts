// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
import * as ts from "typescript"
import parse from "./parser";

// const tsConfig: ts.CompilerOptions = {
// module: ts.ModuleKind.CommonJS,
// noEmitOnError: true,
// noImplicitAny: true,
// target: ts.ScriptTarget.ES5,
// };
export default class TsAST {
    sourceFilesPath: string;
    tsConfig: ts.CompilerOptions | string;
    constructor(tsConfig: ts.CompilerOptions | string, sourceFilesPath: string) {
        this.sourceFilesPath = sourceFilesPath
        this.tsConfig = tsConfig
    }
    init() {
        // TODO: implement output as json or sum from parse function
        parse(this.tsConfig as string, this.sourceFilesPath)
        // TODO: write json file with parsed output
        // fs.writeFileSync("classes.json", JSON.stringify());
        // TODO: export it to uml builder
        return;
    }
}