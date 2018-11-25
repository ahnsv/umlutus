"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_plantuml_1 = __importDefault(require("node-plantuml"));
var fs_1 = __importDefault(require("fs"));
function buildUml() { }
exports.buildUml = buildUml;
function buildClass() { }
exports.buildClass = buildClass;
function buildModule() { }
exports.buildModule = buildModule;
var gen = node_plantuml_1.default.generate("input-file");
gen.out.pipe(fs_1.default.createWriteStream("output-file.png"));
