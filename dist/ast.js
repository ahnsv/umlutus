"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = __importDefault(require("./parser"));
// const tsConfig: ts.CompilerOptions = {
// module: ts.ModuleKind.CommonJS,
// noEmitOnError: true,
// noImplicitAny: true,
// target: ts.ScriptTarget.ES5,
// };
var TsAST = /** @class */ (function () {
    function TsAST(tsConfig, sourceFilesPath) {
        this.sourceFilesPath = sourceFilesPath;
        this.tsConfig = tsConfig;
    }
    TsAST.prototype.init = function () {
        // TODO: implement output as json or sum from parse function
        parser_1.default(this.tsConfig, this.sourceFilesPath);
        // TODO: write json file with parsed output
        // fs.writeFileSync("classes.json", JSON.stringify());
        // TODO: export it to uml builder
        return;
    };
    return TsAST;
}());
exports.default = TsAST;
