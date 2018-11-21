// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
import * as ts from "typescript"
import * as fs from "fs"

// const tsConfig: ts.CompilerOptions = {
//     module: ts.ModuleKind.CommonJS,
//     noEmitOnError: true,
//     noImplicitAny: true,
//     target: ts.ScriptTarget.ES5,
// };
export class TsAST {
    sourceFile: ts.SourceFile;
    tsConfig: ts.CompilerOptions;
    constructor(tsConfig: ts.CompilerOptions, sourceFile: ts.SourceFile) {
        this.sourceFile = sourceFile
        this.tsConfig = tsConfig
    }
    init() {
        const compilerHost = ts.createCompilerHost(this.tsConfig, true)
        const program = ts.createProgram(this._getFiles(this.sourceFile), this.tsConfig, compilerHost)
        const checker = program.getTypeChecker()
        for (const sourceFile of program.getSourceFiles()) {
            if (!sourceFile.isDeclarationFile) {
                // TODO: how to use two-args function as one-arg function
                ts.forEachChild(sourceFile, this._visit);
            }
        }
    }
    /*
     * traverse thru file directory and get files
     * @params sourceFile: ts.SourceFile
     * @returns string[]
     */
    private _getFiles(sourceFile: ts.SourceFile): string[] {
        return []
    }
    private _visit(node: ts.Node, checker?: ts.TypeChecker) {

    }
}