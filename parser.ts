
import * as fs from "fs";
import * as ts from "typescript";

// TODO: figure out how to walk thru inputFiles, parse, then output AST
export class Delinter {
    constructor() { }
    parse(file: ts.SourceFile) {
        this._delint(file)
    }
    private _delint(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                this._delintClass(node)
                break;
            case ts.SyntaxKind.EnumDeclaration:
                this._delintEnum(node)
            default:
                ts.forEachChild(node, (n) => { this._delint(n) })
                break;
        }
    }
    private _delintClass(node: ts.Node) {

    }

    private _delintEnum(node: ts.Node) {

    }
}