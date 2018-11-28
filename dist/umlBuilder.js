"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_plantuml_1 = __importDefault(require("node-plantuml"));
var fs_1 = __importDefault(require("fs"));
function buildUml() { }
exports.buildUml = buildUml;
function buildGeneralization() { }
exports.buildGeneralization = buildGeneralization;
function buildRealization() { }
exports.buildRealization = buildRealization;
function buildDependency() { }
exports.buildDependency = buildDependency;
function buildAssociation() { }
exports.buildAssociation = buildAssociation;
function buildDirectAssociation() { }
exports.buildDirectAssociation = buildDirectAssociation;
function buildAggregation() { }
exports.buildAggregation = buildAggregation;
function buildComposition() { }
exports.buildComposition = buildComposition;
var gen = node_plantuml_1.default.generate("./example/input-file.puml");
gen.out.pipe(fs_1.default.createWriteStream("output-file.png"));
