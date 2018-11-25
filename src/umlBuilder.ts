import plantuml from "node-plantuml"
import fs from "fs"

export function buildUml() { }
export function buildClass() { }
export function buildModule() { }

const gen = plantuml.generate("input-file");
gen.out.pipe(fs.createWriteStream("output-file.png"))
