"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = __importStar(require("typescript"));
// TODO: figure out how to walk thru inputFiles, parse, then output AST
var Delinter = /** @class */ (function () {
    function Delinter() {
    }
    Delinter.prototype.parse = function (file) {
        this._delint(file);
    };
    Delinter.prototype._delint = function (node) {
        var _this = this;
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                this._delintClass(node);
                break;
            case ts.SyntaxKind.EnumDeclaration:
                this._delintEnum(node);
            default:
                ts.forEachChild(node, function (n) { _this._delint(n); });
                break;
        }
    };
    Delinter.prototype._delintClass = function (node) {
    };
    Delinter.prototype._delintEnum = function (node) {
    };
    return Delinter;
}());
exports.Delinter = Delinter;
