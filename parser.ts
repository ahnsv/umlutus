import { Project, Directory, SyntaxKind, Node as wrappedNode, ForEachChildTraversalControl } from "ts-simple-ast"
import * as ts from "typescript"

export default function parse(tsConfigFilePath: string, directoryPath: string) {
    const project = new Project({
        tsConfigFilePath
    });
    const directory: Directory = project.getDirectoryOrThrow(directoryPath)
    const sourceFiles = directory.getSourceFiles()
    for (const sourceFile of sourceFiles) {
        sourceFile.forEachChild((child) => {
            switch (child.getKind()) {
                case SyntaxKind.ClassDeclaration:
                    console.log("class found!")
                    parseClassNode(child)
                    break
                case SyntaxKind.EnumDeclaration:
                    console.log("enum found!")
                    child.getFullText()
                    break
                default:
                    child.getFullText()
                    break
            }
        })
    }
}

function parseClassNode(node: wrappedNode) {
    switch (node.getKind()) {
        case ts.SyntaxKind.PropertyDeclaration:
            console.log("====================================");
            console.log("property declaration");
            console.log("====================================");
            break;
        case ts.SyntaxKind.ExtendsKeyword:
        case ts.SyntaxKind.StaticKeyword:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
            break;
        case ts.SyntaxKind.MethodDeclaration:
            console.log("====================================");
            console.log("method declaration");
            console.log("====================================");
            break;
        default:
            console.log("====================================");
            console.log("default hi");
            console.log("====================================");
            node.forEachChild((n) => { parseClassNode.bind(n) })
            break;
    }
}

function parseEnumNode(node: wrappedNode) { }
function parseInterfaceNode(node: wrappedNode) { }