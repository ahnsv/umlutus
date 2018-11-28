import plantuml from "node-plantuml"
import fs from "fs"

export function buildUml() { }
export function buildGeneralization() { }
export function buildRealization() { }
export function buildDependency() { }
export function buildAssociation() { }
export function buildDirectAssociation() { }
export function buildAggregation() { }
export function buildComposition() { }

const gen = plantuml.generate("./example/input-file.puml")
gen.out.pipe(fs.createWriteStream("output-file.png"))
