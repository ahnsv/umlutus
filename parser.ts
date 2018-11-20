
import * as fs from "fs";
import * as ts from "typescript";

const inputFile = process.argv[2];
const sourceCode = fs.readFileSync(inputFile, "utf-8");
const sourceFile = ts.createSourceFile(inputFile, sourceCode, ts.ScriptTarget.Latest, true);
// tslint:disable-next-line:no-console
console.log(JSON.stringify(sourceFile, null, 2));

// TODO: figure out how to walk thru inputFiles, parse, then output AST
