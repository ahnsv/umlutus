import { getAst, parseDeclaration } from "./parser"
import {} from "./umlBuilder"

export function umulutus(tsConfigPath: string, sourceFilesPaths: string[]) {
    const ast = getAst(tsConfigPath, sourceFilesPaths)
    const files = ast.getSourceFiles()
    const declarations = files.map(f => {
        const classes = f.getClasses();
        const interfaces = f.getInterfaces();
        const path = f.getFilePath();
        return {
            fileName: path,
            classes: classes.map(parseDeclaration),
            interfaces: interfaces.map(parseDeclaration)
        };
    });
}
