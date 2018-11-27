"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var ts = __importStar(require("typescript"));
function umlutus(sourceFilesPaths, tsConfigPath) {
    var output = parser_1.getJSONdocumentation(sourceFilesPaths, tsConfigPath);
    console.log("output is ", output);
}
exports.umlutus = umlutus;
umlutus(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
});
